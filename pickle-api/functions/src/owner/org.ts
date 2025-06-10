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





// --- CREATE NEW ---
orgRouter.post("/", authenticateToken, async (req: Request, res: Response) => {
  const org = req.body;
  const name = (req as any).name;
  const uid = (req as any).uid;
  if (!org.name || !org.address || !org.contactNo) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }
  if (org.id) {
    return res.status(403).json({ error: 'Update forbidden' });
  }

  //TODO check conflicting org name
  //TODO check that user only has 1 org

  org.owner = uid;
  org.createdBy = uid;
  org.createdByEmail = (req as any).email;
  org.createdByName = name;
  org.createdDate = new Date().toISOString();
  console.log(`Org save request. user: ${name} org: `, org);

  try {
    const saved = await db.collection(collectionNames.org).add(org);
    org.id = saved.id;
    return res.json(org);
  } catch (error) {
    console.error("Error saving org:", error);
    return res.status(500).json({ error: "Failed to save org"});
  }
});
