import * as admin from "firebase-admin";
import {Request, Response, NextFunction} from "express";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Attach user info to request object
    (req as any).uid = decodedToken.uid;
    // Set name if present
    if (decodedToken.name) {
        (req as any).name = decodedToken.name;
    }
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}