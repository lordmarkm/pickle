import { admin } from "../firebase";
import {Router, Request, Response} from "express";
import { authenticateTokenOrRecaptcha } from "../auth/auth-or-recaptcha";

export const masterRouter = Router();

const defaultMaster = {
  orgs : [
    {
      name: "ICB",
      courts: [
        {
          id: "icb-outdoor",
          org: "ICB",
          name: "Outdoor"
        },
        {
          id: "indoor1",
          org: "ICB",
          name: "Indoor 1",
          start: "08:00:00",
          end: "12:00:00"
        }
      ]
    },
    {
      name: "Deco",
      courts: [
        {
          id: "deco1",
          org: "Deco",
          name: "Decourt 1"
        }
      ]
    },
    {
      name: "DE Apartments",
      courts: [
        {
          id: "de-outdoor",
          org: "DE Apartments",
          name: "DE Outdoor"
        }
      ]
    }
  ]
};

// GET master list of all courts for the sidebar
masterRouter.get("/", authenticateTokenOrRecaptcha, async (req: Request, res: Response) => {
  const db = admin.firestore();
  const col = db.collection("master");

  try {
    const docRef = col.doc("master");
    const doc = await docRef.get();
    let master: any = defaultMaster;
    if (!doc.exists) {
      await docRef.set(defaultMaster);
    } else {
      master = doc.data()!;
    }

    return res.status(200).json(master);
  } catch (error) {
    console.error("Error retrieving master list:", error);
    return res.status(500).json({ error: "Failed to retrieve master list" });
  }
});










