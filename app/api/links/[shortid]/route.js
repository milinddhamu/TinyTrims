import UserModel from "@/models/UserModel";
import connectMongoDb from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {

  const { shortid } = params;
  const currentDate = new Date();

  await connectMongoDb();

  // Check if linkid is in params
  if (!shortid) {
    return NextResponse.json({ error: "Link ID not provided" }, { status: 400 });
  }

  try {
    const userWithLink = await UserModel.findOne({ "domains.links.id": shortid });

    if (userWithLink) {
      const links = userWithLink.domains.flatMap((domain) => domain.links.find(link => link.id === shortid));

      try {
        if(links){
          const result = await UserModel.updateOne(
            { "domains.links.id": shortid.toString() },
            {
              $push: {
                "domains.$[domain].links.$[link].views": {
                  timestamp: currentDate.getTime(),
                },
              },
            },
            {
              arrayFilters: [
              { "domain.links.id": shortid.toString() },
              { "link.id": shortid.toString() },
            ],
          }
          );
          console.log(result)
          
          if (result?.modifiedCount > 0) {
            return NextResponse.json({ links }, { status: 200 });
          } else {
            return NextResponse.json({ message: "Link not modified, unable to update views" }, { status: 404 });
          }
        } else {
          return NextResponse.json({ message: "Link not found" }, { status: 404 });
        }
      } catch (error) {
        return NextResponse.json({ message: "Error updating views", error }, { status: 500 });
      }
    } 
  } catch (error) {
    console.error('Error retrieving data:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};