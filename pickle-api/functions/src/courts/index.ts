import * as functions from 'firebase-functions';
import express from 'express';
import { favoritesRouter } from './favorites';
import { masterRouter } from './master';

const app = express();
app.use(express.json()); // for parsing JSON request bodies

app.use('/favorites', favoritesRouter);
app.use('/master', masterRouter);

export const courts = functions.https.onRequest(app);
