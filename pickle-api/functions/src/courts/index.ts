import express from 'express';
import cors from 'cors';
import { baseRouter } from './court';
import { favoritesRouter } from './favorites';
import { masterRouter } from './master';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

const app = express();
app.use(cors({
  origin: ['http://localhost:4200', 'https://dumaget.me', 'https://beta.dumaget.me', 'https://dumaget-me.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Recaptcha-Token'],
}));
app.use(express.json()); // for parsing JSON request bodies

app.use('/', baseRouter);
app.use('/favorites', favoritesRouter);
app.use('/master', masterRouter);

const recaptchaSecret = defineSecret("recaptcha");
export const courts = onRequest(
  {
    region: 'asia-southeast1',
    secrets: [recaptchaSecret]
  },
  app
);
