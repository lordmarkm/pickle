import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateToken } from "../auth/auth";

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

    return res.json(doc.data());
  } catch (error) {
    console.error('Error retrieving booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

bookingsRouter.get("/", async (req: Request, res: Response) => {
  const courtId = req.query.courtId as string;
  const date = req.query.date as string;
  console.log(`Retrieving bookings. Court ID: ${courtId}, date: ${date}`);
  if (!courtId || !date) {
    return res.status(400).json({ error: "courtId or date is missing" });
  }

  try {
    const snapshot = await db
      .collection("bookings")
      .where("courtId", "==", courtId)
      .where("date", "==", date)
      .get();
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
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










bookingsRouter.post("/", authenticateToken, async (req: Request, res: Response) => {
  const booking = req.body;
  const name = (req as any).name;
  console.log(`Booking save request. user: ${name} booking: `, booking);
  booking.title = name;
  booking.paid = false;
  booking.createdBy = (req as any).uid;
  booking.createdByEmail = (req as any).email;
  booking.createdByName = name;
  booking.createdDate = new Date().toISOString();

  //TODO verify no overlap

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
