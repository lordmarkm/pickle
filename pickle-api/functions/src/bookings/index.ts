import express from 'express';
import cors from 'cors';
import { bookingsRouter } from './bookings';
import { paymentsRouter } from './payment';
import { onRequest } from 'firebase-functions/v2/https';

const app = express();
app.use(cors({
  origin: ['http://localhost:4200', 'https://dumaget.me', 'https://beta.dumaget.me', 'https://dumaget-me.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Recaptcha-Token'],
}));
app.use(express.json()); // for parsing JSON request bodies

app.use('/', bookingsRouter);
app.use('/:id/pay', paymentsRouter);

export const bookings = onRequest(
  {
    region: 'asia-southeast1'
  },
  app
);