import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateToken } from "../auth/auth";
import { authenticateTokenOrRecaptcha } from "../auth/auth-or-recaptcha";
import { Timestamp } from 'firebase-admin/firestore';

export const bookingsRouter = Router();
const db = admin.firestore();

bookingsRouter.get('/:id', async (req, res) => {
  const bookingId = req.params.id;

  try {
    const docRef = db.collection('bookings').doc(bookingId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const data = doc.data();

    // Defensive check
    if (!data || !data.start || !data.end) {
      return res.status(500).json({ error: 'Malformed booking data' });
    }

    // Clean and format
    delete data.createdByEmail;
    delete data.createdByName;
    delete data.ttl;

    return res.json({
      id: doc.id,
      ...data,
      start: data.start.toDate().toISOString(),
      end: data.end.toDate().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

bookingsRouter.get("/", authenticateTokenOrRecaptcha, async (req: Request, res: Response) => {
  const courtId = req.query.courtId as string;
  const date = req.query.date as string;
  console.log(`Retrieving bookings. Court ID: ${courtId}, date: ${date}`);
  if (!courtId || !date) {
    return res.status(400).json({ error: "courtId or date is missing" });
  }

  const now = Timestamp.now();
  try {
    const snapshot = await db
      .collection("bookings")
      .where("courtId", "==", courtId)
      .where("date", "==", date)
      .where("ttl", ">", now)
      .get();
    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.createdByEmail;
      delete data.createdByName;
      delete data.ttl;
      data.start = data.start.toDate().toISOString();
      data.end = data.end.toDate().toISOString();
      return {
        id: doc.id,
        ...data
      };
    });
    return res.json({
      courtId,
      date,
      bookings
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    return res.status(500).json({ error: "Failed to retrieve bookings" });
  }
});









const twentyMins = 20 * 60 * 1000; // 20 minutes in milliseconds
bookingsRouter.post("/", authenticateToken, async (req: Request, res: Response) => {
  const booking = req.body;
  const name = (req as any).name;
  booking.title = name;
  booking.paid = false;
  booking.createdBy = (req as any).uid;
  booking.createdByEmail = (req as any).email;
  booking.createdByName = name;
  booking.createdDate = new Date().toISOString();
  booking.ttl = new Date(Date.now() + twentyMins);
  booking.start = new Date(booking.start);
  booking.end = new Date(booking.end);
  console.log(`Booking save request. user: ${name} booking: `, booking);

  // --- OVERLAP VERIFICATION ---
  try {
    // Query for any existing bookings that overlap with the new one
    const overlapSnapshot = await db
      .collection("bookings")
      .where("courtId", "==", booking.courtId)
      .where("date", "==", booking.date)
      .where("start", "<", booking.end)
      .where("end", ">", booking.start)
      .where("ttl", ">", new Date())
      .get();

    if (!overlapSnapshot.empty) {
      console.log(`Overlap detected for courtId: ${booking.courtId}, date: ${booking.date}, new start: ${booking.start}, new end: ${booking.end}`);
      overlapSnapshot.docs.forEach(doc => {
          console.log('Conflicting booking:', doc.id, doc.data());
      });
      return res.status(409).json({ error: "Booking overlaps with an existing reservation." });
    }
    console.log('No overlap detected. Proceeding to save booking.');

  } catch (error) {
    console.error("Error checking for booking overlap:", error);
    return res.status(500).json({ error: "Failed to check for booking overlap." });
  }

  if (booking.id) {
    return res.status(403).json({ error: 'Update forbidden' });
  }

  try {
    const saved = await db.collection("bookings").add(booking);
    booking.id = saved.id;
    return res.json(booking);
  } catch (error) {
    console.error("Error saving booking:", error);
    return res.status(500).json({ error: "Failed to save booking"});
  }
});



bookingsRouter.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const uid = (req as any).uid; // optional: use to check ownership

  if (!bookingId) {
    return res.status(400).json({ error: "Missing booking ID" });
  }

  try {
    const docRef = db.collection("bookings").doc(bookingId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Booking not found" });
    }

    //check if the user owns the booking
    const booking = doc.data();
    if (booking?.createdBy !== uid) {
     return res.status(403).json({ error: "Not authorized to delete this booking" });
    }

    await docRef.delete();

    console.log(`Booking ${bookingId} deleted`);
    return res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({ error: "Failed to delete booking" });
  }
});
