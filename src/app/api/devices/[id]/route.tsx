// פונקציה למחיקת מכשיר

import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI as string;


// פונקציה למחיקת מכשיר
export async function DELETE(request: Request) {
    const client = new MongoClient(uri);
    
    try {
      const { id } = await request.json(); // קריאת ה-id מתוך גוף הבקשה
  
      if (!id) {
        return NextResponse.json({ message: "Device ID is required" }, { status: 400 });
      }
  
      // וידוא ש-id תקין כ-ObjectId של MongoDB
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        console.error("Invalid device ID format:", error);
        return NextResponse.json({ message: "Invalid device ID format" }, { status: 400 });
      }
  
      await client.connect();
      const database = client.db("energy");
      const devicesCollection = database.collection("device");
  
      // מחיקת המכשיר עם ה-ObjectId
      const result = await devicesCollection.deleteOne({ _id: objectId });
  
      if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Device not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Device deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error("Error deleting device:", error);
      return NextResponse.json({ message: "Error deleting device", error: error }, { status: 500 });
    } finally {
      await client.close();
    }
  }
  