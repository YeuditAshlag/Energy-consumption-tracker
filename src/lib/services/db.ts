// src/lib/db.ts
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);
export async function connectToDatabase() {
  await client.connect();
  const db = client.db();
//   return { db, client };
const devicesCollection = db.collection('device'); // שם האוסף
return { db, devicesCollection, client };
}

