import express, {Request, Response} from "express";
import * as functions from "firebase-functions";
import { authenticateToken } from "../auth/auth";

const app = express();
app.use(express.json()); // for parsing JSON request bodies

// Dummy in-memory store (replace with Firestore or a DB in production)
const favoriteCourts: Record<string, string[]> = {};

// POST /courts/favorites — add a favorite court
app.post("/favorites", (req: Request, res: Response) => {
  const {userId, courtId} = req.body;

  if (!userId || !courtId) {
    return res.status(400).json({error: "Missing userId or courtId"});
  }

  if (!favoriteCourts[userId]) {
    favoriteCourts[userId] = [];
  }

  if (!favoriteCourts[userId].includes(courtId)) {
    favoriteCourts[userId].push(courtId);
  }

  console.log(`Added court ${courtId} to favorites for user ${userId}`);
  return res.status(200).json({message: "Favorite added"});
});







// GET /courts/favorites?userId=123 — get favorite courts for a user
app.get("/favorites", authenticateToken, (req: Request, res: Response) => {
  const uid = (req as any).uid;
  const name = (req as any).name;
  console.log(`Retrieving favorite courts. User name: ${name}, UID: ${uid}`);
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({error: "Missing userId"});
  }

  const courts = favoriteCourts[userId] || [];
  return res.status(200).json({courts});
});










export const courts = functions.https.onRequest(app);
