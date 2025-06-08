import { admin } from "../firebase";
import { Request, Response, NextFunction } from "express";

export async function authenticateTokenOrRecaptcha(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return verifyAuthHeader(authHeader, req, res, next);
  }

  const recaptchaHeader = req.headers['x-recaptcha-token'] as string | undefined;
  if (!recaptchaHeader) {
    return res.status(401).json({ error: "No auth header or recaptcha token" });
  }

  return verifyRecaptcha(recaptchaHeader, req, res, next);
}

async function verifyAuthHeader(authHeader: string, req: Request, res: Response, next: NextFunction) {
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Invalid auth header" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user info to request object
    (req as any).uid = decodedToken.uid;
    (req as any).name = decodedToken.name || null;
    (req as any).email = decodedToken.email || null;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

async function verifyRecaptcha(recaptchaHeader: string, req: Request, res: Response, next: NextFunction) {
  try {
    console.log('verifying recaptcha. header=', recaptchaHeader);
    // Verify recaptcha token with Google API
    const recaptchaSecretKey = process.env.recaptcha;
    if (!recaptchaSecretKey) {
      console.error('recaptchaSecretKey not found');
      return res.status(500).json({ error: "Failed recaptcha verification" });
    }
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(recaptchaSecretKey)}&response=${encodeURIComponent(recaptchaHeader)}`
    });

    const data = await response.json();

    if (!data.success || data.score < 0.5) {
      // Adjust threshold score as needed
      return res.status(401).json({ error: "Failed recaptcha verification" });
    }

    // Optionally attach some info about the recaptcha validation to request
    (req as any).recaptcha = {
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname
    };

    return next();
  } catch (error) {
    console.error("Error verifying recaptcha:", error);
    return res.status(500).json({ error: "Error verifying recaptcha token" });
  }
}
