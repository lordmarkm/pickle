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

// --- CREATE COURT ---
orgRouter.post("/:orgId/court", authenticateToken, async (req: Request, res: Response) => {
  const court = req.body;
  const name = (req as any).name;
  const uid = (req as any).uid;
  const orgId = req.params.orgId;
  const org = await getOrg(orgId);
  if (!org || !court.name || !court.start || !court.end) {
    return res.status(400).json({ error: 'Missing required court fields' });
  }
  if (court.id) {
    return res.status(403).json({ error: 'Update forbidden' });
  }
  if (org.owner !== uid) {
    return res.status(403).json({ error: 'Only org owner can add courts' });
  }

  court.org = org.id;
  court.orgName = org.name;
  court.owner = uid;
  court.createdBy = uid;
  court.createdByEmail = (req as any).email;
  court.createdByName = name;
  court.createdDate = new Date().toISOString();
  console.log(`Court save request. user: ${name} court: `, court);

  try {
    const saved = await db.collection(collectionNames.court).add(court);
    court.id = saved.id;
    return res.json(court);
  } catch (error) {
    console.error("Error saving court:", error);
    return res.status(500).json({ error: "Failed to save court"});
  }
});


export async function getOrg(orgId: string): Promise<any | null> {
  try {
    const doc = await db.collection(collectionNames.org).doc(orgId).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    return {
      id: doc.id,
      ...data
    };
  } catch (error) {
    console.error("getOrg error:", error);
    throw error;
  }
}
