import UserModel from "@/models/UserModel";
import connectMongoDb from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { shortid } = params;
  await connectMongoDb();

  // Check if linkid is in params
  if (!shortid) {
    return NextResponse.json({ error: "Link ID not provided" }, { status: 400 });
  }

  try {
    const userWithLink = await UserModel.findOne({ "domains.links.id": shortid });

    if (userWithLink) {
      const link = userWithLink.domains.flatMap((domain) => domain.links.find((link) => link.id === shortid));

      if (link) {
        return NextResponse.json({ link }, { status: 201 });
      } else {
        return NextResponse.json({ message: "Link not found in user's domains" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
