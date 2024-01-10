// api/users.js

import UserModel from "@/models/UserModel";
import connectMongoDb from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Please sign in to continue" }, { status: 400 });
  }
    const { tag, name, email, timestamp, domains = [] } = await req.json();
    await connectMongoDb(); // Connect to MongoDB
      // Save the user to the database
      await UserModel.create({ tag, name, email, timestamp, domains });
      console.log("task done")
      return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
})

export const GET = auth(async (req) =>{
  if (!req.auth) {
    return NextResponse.json({ error: "Please sign in to continue" }, { status: 400 });
  } 
  await connectMongoDb();
  const users = await UserModel.find();
  return NextResponse.json({ users });
})

export const DELETE = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: "Please sign in to continue" }, { status: 400 });
  }
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDb();
  await UserModel.findByIdAndDelete(id);
  return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
})