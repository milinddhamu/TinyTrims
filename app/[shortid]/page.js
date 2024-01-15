import { notFound, redirect } from "next/navigation";
import axios from 'axios';

async function getLinkDataByShortid(shortid) {
  try {
    const response = await axios.get(`https://tinytrims.vercel.app/api/links/${encodeURIComponent(shortid)}`);
    return response.data;
  } catch (error) {
    return notFound();
  }
}

async function getLinkData(params) {
  const shortid = params.shortid;
  return await getLinkDataByShortid(shortid);
}

export async function generateMetadata({ params, searchParams }) {
  const data = await getLinkData(params);
  const matchedData = data?.links.find(entry => entry !== null);

  return {
    metadataBase: new URL('https://localhost:3000'),
    title: matchedData.title,
    description: matchedData.description,
    openGraph: {
      title: matchedData.title,
      description: matchedData.description,
      images: [matchedData.image],
    },
    twitter: {
      title: matchedData.title,
      description: matchedData.description,
      images: [matchedData.image], // Must be an absolute URL
    },
  };
}

export default async function Page({ params }) {
  const data = await getLinkData(params);
  const matchedLinkData = data?.links.find(entry => entry !== null);
  if (matchedLinkData) {
    const destination = matchedLinkData.destination;
    if (destination) {
      // console.log('redirected')
      return redirect(destination);
    } else {
      return notFound();
    }
  } else {
    return notFound();
  }
}
