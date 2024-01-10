import { notFound, redirect } from "next/navigation";
import axios from 'axios';

async function getLinkData({ shortid }) {
  try {
    const response = await axios.get(`https://tinytrims.vercel.app/api/links/${encodeURIComponent(shortid)}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function generateMetadata({ params, searchParams }, parent) {
  // read route params
  const shortid = params.shortid
  const response = await axios.get(`https://tinytrims.vercel.app/api/links/${encodeURIComponent(shortid)}`);
  const data = response.data;
  const matchedData = data?.links.find(entry => entry !== null);
 
  return {
    title: matchedData.title,
    description: matchedData.description,
    openGraph: {
      images: [{  url: matchedData.image, 
                  width:1200,
                  height:630 }],
    },
  }
}

export default async function Page({ params }) {
    const shortid = params.shortid;
    const res = await getLinkData({ shortid });
    const matchedLinkData = res?.links.find(entry => entry !== null);
    if (matchedLinkData) {
      const destination = matchedLinkData.destination;
      if (destination) {
          return redirect(destination);
      } else {
          return notFound();
      }
  } else {
      return notFound();
  }
}
