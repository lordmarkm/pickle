import { admin } from "../firebase";
import express, {Request, Response} from "express";
import * as functions from "firebase-functions";

const app = express();
app.use(express.json()); // for parsing JSON request bodies

const defaultMaster = {
  "ICB": [
    "abc",
    "123"
  ],
  "Deco": [
    "abc",
    "123"
  ]
};

// GET master list of all courts for the sidebar
// TODO require recaptcha on public APIs to prevent automated abuse
app.get("/master", async (req: Request, res: Response) => {
  const db = admin.firestore();
  const col = db.collection("master");

  try {
    const docRef = col.doc("master");
    const doc = await docRef.get();
    let master = defaultMaster;
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










export const courts = functions.https.onRequest(app);
