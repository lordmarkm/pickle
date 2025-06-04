import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateToken } from "../auth/auth";

export const paymentsRouter = Router({ mergeParams: true });
const db = admin.firestore();

paymentsRouter.put("/", authenticateToken, async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const uid = (req as any).uid;
  const name = (req as any).name;
  console.log(`User with id ${uid}, ${name} is trying to pay for booking with bookingId: ${bookingId}`);
  try {
    const docRef = db.collection('bookings').doc(bookingId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await docRef.update({ paid: true});
    const updatedDoc = await docRef.get(); 
    return res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error retrieving booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
