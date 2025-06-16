import { Timestamp } from 'firebase-admin/firestore';

export const collectionNames = {
  court: "court",
  master: "master",
  org: "org",
};

export const twentyMins = 20 * 60 * 1000; // 20 minutes in milliseconds
export const PERMANENT_TTL_TIMESTAMP = Timestamp.fromDate(new Date('2125-01-01T00:00:00Z')); // January 1, 2125 UTC
