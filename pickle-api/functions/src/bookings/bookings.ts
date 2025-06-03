import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateToken } from "../auth/auth";

export const bookingsRouter = Router();
const db = admin.firestore();


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
  //TODO verify no overlap

  try {
    db.collection("bookings").add(booking);
    return res.json(booking);
  } catch (error) {
    console.error("Error saving booking:", error);
    return res.status(500).json({ error: "Failed to save booking"});
  }
});
