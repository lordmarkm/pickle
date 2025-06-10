import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateTokenOrRecaptcha } from "../auth/auth-or-recaptcha";
import { collectionNames } from "../constants";

export const baseRouter = Router();
const db = admin.firestore();

baseRouter.get("/org", authenticateTokenOrRecaptcha, async (req: Request, res: Response) => {
  const { orgName } = req.query;
  console.log(`Finding courts by org. Org: ${orgName}`);

  if (!orgName || typeof orgName !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'orgName' in request body" });
  }

  const userDoc = db
    .collection(collectionNames.court)
    .where("org", "==", orgName);

  try {
    const docSnapshot = await userDoc.get();

    if (docSnapshot.empty) {
      console.log(`No courts found for organization: ${orgName}`);
      return res.status(200).json({ courts: [] });
    }

    const courts: any[] = [];
    docSnapshot.forEach(doc => {
      const courtData = doc.data();
      const sanitizedCourt: any = {
        id: doc.id,
        ...courtData
      };

      delete sanitizedCourt.createdByName;
      delete sanitizedCourt.createdByEmail;

      courts.push(sanitizedCourt);
    });

    console.log(`Found ${courts.length} courts for organization: ${orgName}`);
    return res.status(200).json({ courts });
  } catch (error) {
    console.error("Error finding courts", error);
    return res.status(500).json({ error: "Error finding courts" });
  }
});






