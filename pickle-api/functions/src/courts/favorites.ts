import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateToken } from "../auth/auth";

export const favoritesRouter = Router();

favoritesRouter.put("/", authenticateToken, async (req: Request, res: Response) => {
  const uid = (req as any).uid;
  const { courtId } = req.body;
  const name = (req as any).name;
  console.log(`Adding favorite courts. User name: ${name}, UID: ${uid}, court: ${courtId}`);

  if (!courtId || typeof courtId !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'courtId' in request body" });
  }

  const db = admin.firestore();
  const userDoc = db.collection("favorites").doc(uid);
  const docSnapshot = await userDoc.get();

  try {
    // Atomically add to array (avoids duplicates)
    if (!docSnapshot.exists) {
      await userDoc.set({ courts: [courtId] });
    } else {
      await userDoc.set(
        { courts: admin.firestore.FieldValue.arrayUnion(courtId) },
        { merge: true } // Important to preserve existing fields
      );
    }

    console.log(`Added court ${courtId} to favorites for UID: ${uid}`);
    return res.status(200).json({ message: "Court added to favorites" });
  } catch (error) {
    console.error("Error adding favorite court:", error);
    return res.status(500).json({ error: "Failed to add court to favorites" });
  }
});






// GET /courts/favorites?userId=123 — get favorite courts for a user
favoritesRouter.get("/", authenticateToken, async (req: Request, res: Response) => {
  const uid = (req as any).uid;
  const name = (req as any).name;
  console.log(`Retrieving favorite courts. User name: ${name}, UID: ${uid}`);

  const db = admin.firestore();

  try {
    const doc = await db.collection("favorites").doc(uid).get();
    const data = doc.exists ? doc.data() : { courts: [] };

    return res.status(200).json({ courts: data?.courts || [] });
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    return res.status(500).json({ error: "Failed to retrieve favorites" });
  }
});










