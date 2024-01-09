// api/users.js

import UserModel from "@/models/UserModel";
import connectMongoDb from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req ) {
    const { tag, name, email, timestamp, domains = [] } = await req.json();
    await connectMongoDb(); // Connect to MongoDB
      // Save the user to the database
      await UserModel.create({ tag, name, email, timestamp, domains });
      console.log("task done")
      return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
}

export async function GET() {
  await connectMongoDb();
  const users = await UserModel.find();
  return NextResponse.json({ users });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDb();
  await UserModel.findByIdAndDelete(id);
  return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
}