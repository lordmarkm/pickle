import * as functions from 'firebase-functions';
import express from 'express';
import { bookingsRouter } from './bookings';
import { paymentsRouter } from './payment';

const app = express();
app.use(express.json()); // for parsing JSON request bodies

app.use('/', bookingsRouter);
app.use('/:id/pay', paymentsRouter);

export const bookings = functions.https.onRequest(app);
