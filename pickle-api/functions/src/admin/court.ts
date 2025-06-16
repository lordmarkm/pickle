import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateToken } from "../auth/auth";
import { collectionNames } from "../constants";
import { Court } from "../models/court";

export const courtsRouter = Router();
const db = admin.firestore();

// --- ADD COURT TO THE MASTER LIST OF COURTS ---
courtsRouter.put("/master", authenticateToken, async (req: Request, res: Response) => {
  const courtId = req.query.courtId;
  const admin = (req as any).admin;
  console.log(`Trying to add court to master: ${courtId}`);

  if (!admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (!courtId || typeof courtId !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'courtId' in request params" });
  }

  const court = await findCourtById(courtId);
  if (!court) {
    return res.status(400).json({ error: "No court found with id=" + courtId });
  }

  const col = db.collection(collectionNames.master);
  try {
    const docRef = col.doc("master");
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error('Attempted master update with no existing master record');
    }

    const master = doc.data()!;

    // Try to find existing org entry
    let targetOrg = master.orgs.find((org: any) => org.name === court.orgName);

    if (!targetOrg) {
      // Create a new org entry if it doesn't exist
      targetOrg = {
        name: court.orgName,
        courts: [],
      };
      master.orgs.push(targetOrg);
    }

    const alreadyExists = targetOrg.courts.some((c: any) => c.id === court.id);
    if (!alreadyExists) {
      targetOrg.courts.push({
        id: court.id,
        orgName: court.orgName,
        name: court.name,
        ...(court.start && { start: court.start }),
        ...(court.end && { end: court.end }),
      });
    }

    await docRef.set(master);

    return res.status(200).json({ message: `Court '${court.id}' handled successfully` });
  } catch (error) {
    console.error("Error updating master list:", error);
    return res.status(500).json({ error: "Failed to update master list" });
  }
});

async function findCourtById(courtId: string): Promise<Court | null> {
  try {
    const docRef = db.collection(collectionNames.court).doc(courtId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return null;
    }

    const courtData = docSnapshot.data();
    const courtDataWitId: any = {
      id: docSnapshot.id,
      ...courtData
    };

    return courtDataWitId;
  } catch (error) {
    console.error("Error getting court by ID", error);
    return null;
  }
}




