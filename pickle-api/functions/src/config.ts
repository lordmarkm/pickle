import cors from 'cors';

export const corsConfig = cors({
  origin: ['http://localhost:4200', 'https://dumaget.me', 'https://beta.dumaget.me', 'https://dumaget-me.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Recaptcha-Token'],
});