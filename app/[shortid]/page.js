import { notFound, redirect } from "next/navigation";
import axios from 'axios';

async function getLinkData({ shortid }) {
  try {
    const response = await axios.get(`http://localhost:3000/api/links/${encodeURIComponent(shortid)}`);
    return response.data;
  } catch (error) {
    console.error(error);
    console.log("not found")
    return notFound()
  }
};

export const metadata = {
  title: 'Tiny Trims',
  description: '',
  openGraph:{},
  twitter:{},
}

// export async function generateMetadata({ params, searchParams }, parent) {
//   // read route params
//   const shortid = params.shortid
//   const response = await axios.get(`https://tinytrims.vercel.app/api/links/${encodeURIComponent(shortid)}`);
//   const data = response.data;
//   const matchedData = data?.links.find(entry => entry !== null);
 
//   return {
//     title: matchedData?.title,
//     description: matchedData?.description,
//     openGraph: {
//       title: matchedData?.title,
//       description: matchedData?.description,
//       images: [matchedData?.image],
//     },
//     twitter: {
//       title: matchedData?.title,
//       description: matchedData?.description,
//       images: [matchedData?.image], // Must be an absolute URL
//     },
//   }
// }

export default async function Page({ params }) {
    const shortid = params.shortid;
    const res = await getLinkData({ shortid });
    const matchedLinkData = res?.links.find(entry => entry !== null) ;
    const fetchedMetaData = {
      title: matchedLinkData?.title,
      description: matchedLinkData?.description,
      openGraph: {
        title: matchedLinkData?.title,
        description: matchedLinkData?.description,
        images: [matchedLinkData?.image],
      },
      twitter: {
        title: matchedLinkData?.title,
        description: matchedLinkData?.description,
        images: [matchedLinkData?.image], // Must be an absolute URL
      },
    }
    metadata.title = fetchedMetaData?.title
    metadata.description = fetchedMetaData?.description
    metadata.openGraph = { ...fetchedMetaData?.openGraph }; // Using spread to clone the object
    metadata.twitter = { ...fetchedMetaData?.twitter }; 

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
