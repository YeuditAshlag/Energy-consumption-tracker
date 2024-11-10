import { connectToDatabase } from './db';
import { Device } from '../../types/device';
import {  ObjectId } from 'mongodb';

// פונקציה להוספת מכשיר חדש
export async function addDevice(device: Device) {
  const { db } = await connectToDatabase();
  const devicesCollection = db.collection<Device>('devices');
  const result = await devicesCollection.insertOne({
    ...device,
    _id: new ObjectId(), // יצירת ObjectId חדש
  });
  // החזרת המכשיר שנוסף
  return await devicesCollection.findOne({ _id: result.insertedId });
}


// פונקציה לשליפת כל המכשירים
export async function getDevices() {
  const { db } = await connectToDatabase();
  const devicesCollection = db.collection<Device>('devices');
  return await devicesCollection.find({}).toArray();
}

// פונקציה לעדכון מכשיר קיים
export async function updateDevice(id: string, device: Partial<Device>) {
  const { db } = await connectToDatabase();
  const devicesCollection = db.collection<Device>('devices');
  return await devicesCollection.updateOne(
    { _id: new ObjectId(id) }, // המרת id ל-ObjectId
    { $set: device }
  );
}

// פונקציה למחיקת מכשיר
export async function deleteDevice(id: string) {
  const { db } = await connectToDatabase();
  const devicesCollection = db.collection<Device>('devices');
  return await devicesCollection.deleteOne({ _id: new ObjectId(id) }); // המרת id ל-ObjectId
}
