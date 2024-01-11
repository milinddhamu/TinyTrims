import UserModel from "@/models/UserModel";
import connectMongoDb from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const POST = auth(async (request, { params }) => {
  if(!request.auth){
    return NextResponse.json({error: "Please SignIn to continue"}, { status: 400 });
  };

  const { tag } = params;
  const { linkIds } = await request.json();

  await connectMongoDb();

  try {
    const userWithLink = await UserModel.findOne({ tag });
    if (!userWithLink) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userWithLink) {
      userWithLink.domains.forEach((domain) => {
        domain.links = domain.links.filter((link) => link.id && !linkIds.includes(link.id));
      });
      userWithLink.domains = userWithLink.domains.filter((domain) => domain.links.length > 0);

      await userWithLink.save();

      return NextResponse.json({ success: true });
              
    } 
  } catch (error) {
    console.error('Error retrieving data:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});