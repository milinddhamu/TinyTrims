import connectMongoDb from "@/lib/mongodb";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { auth } from "@/auth";

export const PUT = auth(async(request, { params }) => {
  if(!request.auth){
    return NextResponse.json({error: "Please SignIn to continue"}, { status: 400 });
  };
  const { email } = params;
  const requestData = await request.json();
  await connectMongoDb();

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      let updatedUser;

      if (requestData.domainId && requestData.link) {
        // Check if the domain exists and has at least 5 links
        const existingDomain = existingUser.domains.find(domain => domain.destination === requestData.link.destination);

        if (!existingDomain && existingUser.domains.length >= 5 ) {
          return NextResponse.json({ error: "Domain has reached the maximum number of domains reached (5)" }, { status: 400 });
        }
        
        if (existingDomain && existingDomain.links.length >= 5 ) {
          return NextResponse.json({ error: "Domain has reached the maximum number of links reached (5)" }, { status: 400 });
        }
        

        // Update links in an existing domain
        updatedUser = await UserModel.findOneAndUpdate(
          { email, 'domains._id': requestData.domainId },
          { $push: { 'domains.$.links': requestData.link } },
          { new: true }
        );
      } else if (requestData.domains) {
        // Update the entire domains array
        updatedUser = await UserModel.findOneAndUpdate(
          { email },
          { domains: requestData.domains },
          { new: true }
        );
      } else {
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
      }

      if (updatedUser) {
        return NextResponse.json({ message: "Data updated successfully", user: updatedUser }, { status: 200 });
      } else {
        return NextResponse.json({ message: "User or domain not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
})



export const GET = auth(async (request, { params }) => {
  if (!request.auth) {
    return NextResponse.json({ error: "Please sign in to continue" }, { status: 400 });
  }
  const { email } = params;
  await connectMongoDb();
  const user = await UserModel.findOne({ email });
  return NextResponse.json({ user }, { status: 200 });
})