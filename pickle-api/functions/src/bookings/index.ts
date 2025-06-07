import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { bookingsRouter } from './bookings';
import { paymentsRouter } from './payment';

const app = express();
app.use(cors({
  origin: ['http://localhost:4200', 'https://dumaget.me', 'https://dumaget-me.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // for parsing JSON request bodies

app.use('/', bookingsRouter);
app.use('/:id/pay', paymentsRouter);

export const bookings = functions.https.onRequest({ region: 'asia-southeast1' },app);
