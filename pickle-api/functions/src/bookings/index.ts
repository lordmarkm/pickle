import * as functions from 'firebase-functions';
import express from 'express';
import { bookingsRouter } from './bookings';

const app = express();
app.use(express.json()); // for parsing JSON request bodies

app.use('/', bookingsRouter);

export const bookings = functions.https.onRequest(app);
