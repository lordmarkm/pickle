import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateToken } from "../auth/auth";
import { collectionNames } from "../constants";

export const orgRouter = Router();
const db = admin.firestore();

orgRouter.get("/", authenticateToken, async (req: Request, res: Response) => {
  const uid = (req as any).uid;
  console.log(`Fetching org for UID: ${uid}`);

  try {
    const orgQuery = db.collection(collectionNames.org).where("owner", "==", uid);
    const docSnapshot = await orgQuery.get();

    if (docSnapshot.empty) {
      // ✅ 200 OK with null body
      return res.status(200).json(null);
    }

    const orgData = docSnapshot.docs[0].data();
    const orgId = docSnapshot.docs[0].id;

    return res.status(200).json({ id: orgId, ...orgData });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return res.status(500).json({ message: "Failed to fetch organization.", error: String(error) });
  }
});
