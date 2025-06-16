import express from 'express';
import cors from 'cors';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import admin from 'firebase-admin';
import { courtsRouter } from './court';

const app = express();
app.use(cors({
  origin: ['http://localhost:4200', 'https://dumaget.me', 'https://beta.dumaget.me', 'https://dumaget-me.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Recaptcha-Token'],
}));
app.use(express.json()); // for parsing JSON request bodies
app.use('/courts', courtsRouter);

const recaptchaSecret = defineSecret("recaptcha");

export const adminApp = onRequest(
  {
    region: 'asia-southeast1',
    secrets: [recaptchaSecret]
  },
  app
);

const adminUsers = [
  {
    email: 'markbbmartinez@gmail.com',
    uid: 'fiKDH07l0Egwg3j0VZvtwvV8I5T2'
  }
];

app.get('/set-admin', async (req, res) => {
  try {
    // Use Promise.all to wait for all claims to be set
    await Promise.all(
      adminUsers.map(user => admin.auth().setCustomUserClaims(user.uid, { admin: true }))
    );

    return res.status(200).json({
      message: `Admin claims set for users: ${adminUsers.map(u => u.uid).join(', ')}`
    });
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return res.status(500).json({ error: 'Failed to set admin claim' });
  }
});