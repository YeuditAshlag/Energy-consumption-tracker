
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI as string;


export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("energy");
    const devicesCollection = database.collection("device");

    const devices = await devicesCollection.find({}).toArray();

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json({ message: "Error fetching devices data", error }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  const client = new MongoClient(uri);
  const body = await request.json(); 
  console.log('Adding device with name:', body.name);
  try {
    await client.connect();
    const database = client.db("energy");
    const devicesCollection = database.collection("device");
    const existingDevice = await devicesCollection.findOne({
      name: body.name.trim() // שימוש ב-trim כדי להסיר רווחים
    });

    // אם המכשיר כבר קיים
    if (existingDevice) {
      return NextResponse.json({ 
        message: "Device already exists",
        existingDevice
      }, { status: 400 });
    }

    // הוספת המכשיר אם הוא לא קיים
    const result = await devicesCollection.insertOne({
      ...body,
      _id: new ObjectId(), // יצירת ObjectId חדש
    });

    // החזרת המידע של המכשיר החדש
    const addedDevice = {
      ...body,
      _id: result.insertedId.toString(), // הפיכת ה-ID החדש למחרוזת
    };

    return NextResponse.json(addedDevice); // מחזירים את המכשיר החדש עם כל הנתונים
  } catch (error) {
    console.error("Error adding device:", error);
    return NextResponse.json({ message: "Error adding device", error }, { status: 500 });
  } finally {
    await client.close();
  }
}


export async function PUT(request: Request) {
  const client = new MongoClient(uri);
  const body = await request.json(); // קריאת הנתונים מתוך הבקשה

  const { id, ...updateData } = body;

  try {
    await client.connect();
    const database = client.db("energy");
    const devicesCollection = database.collection("device");

    const result = await devicesCollection.updateOne(
      { _id: new ObjectId(id) }, // המרת id ל-ObjectId
      { $set: updateData } // עדכון השדות שהתקבלו בבקשה
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Device not found" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Device updated successfully' });
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json({ message: "Error updating device", error }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request: Request) {
  const client = new MongoClient(uri);

  try {
    const { id } = await request.json(); // קריאת ה-id מתוך גוף הבקשה
    if (!id) {
      return NextResponse.json({ message: "Device ID is required" }, { status: 400 });
    }
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
