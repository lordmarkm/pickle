import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { corsConfig } from '../config';
import { orgRouter } from './org';

const app = express();
app.use(corsConfig);
app.use(express.json()); // for parsing JSON request bodies

app.use('/org', orgRouter);

const recaptchaSecret = defineSecret("recaptcha");
export const owner = onRequest(
  {
    region: 'asia-southeast1',
    secrets: [recaptchaSecret]
  },
  app
);
