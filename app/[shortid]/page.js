import { notFound, redirect } from "next/navigation";
import axios from 'axios';
import Head from 'next/head';

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

// export async function generateMetadata({ params }) {
//   const data = await getLinkData(params);
//   const matchedData = data?.links.find(entry => entry !== null);
//   return {
//     title: matchedData.title,
//     description: matchedData.description,
//     openGraph: {
//       title: matchedData.title,
//       description: matchedData.description,
//       images: [matchedData.image],
//     },
//     twitter: {
//       title: matchedData.title,
//       description: matchedData.description,
//       images: [matchedData.image], // Must be an absolute URL
//     },
//   };
// };


// export const metadata = {
//     title: "Tiny Trims",
//     description: "",
//     openGraph: {
//       title: "",
//       description: "",
//       images: [],
//     },
//     twitter: {
//       title: "",
//       description: "",
//       images: [], 
//     },
// }

export default async function Page({ params }) {
  const data = await getLinkData(params);
  const matchedLinkData = data?.links.find(entry => entry !== null);
  if (matchedLinkData) {
    const destination = matchedLinkData.destination;
    // metadata.title = matchedLinkData.title
    // metadata.description = matchedLinkData.description 
    // metadata.openGraph.title = matchedLinkData.title
    // metadata.openGraph.description = matchedLinkData.description
    // metadata.openGraph.images = [matchedLinkData.image]
    // metadata.twitter.title = matchedLinkData.title
    // metadata.twitter.description = matchedLinkData.description
    // metadata.twitter.images = [matchedLinkData.image]
    if (destination) {
      return(
        <>
        <Head>
          {/* Title */}
          <title>{matchedLinkData.title}</title>

          {/* Description */}
          <meta name="description" content={matchedLinkData.description} />

          {/* OpenGraph */}
          <meta property="og:title" content={matchedLinkData.title} />
          <meta property="og:description" content={matchedLinkData.description} />
          <meta property="og:image" content={matchedLinkData.image} />

          {/* Twitter */}
          <meta name="twitter:title" content={matchedLinkData.title} />
          <meta name="twitter:description" content={matchedLinkData.description} />
          <meta name="twitter:image" content={matchedLinkData.image} />
        </Head>
        {redirect(destination)}
        </>
      )
      // return redirect(destination)
    } else {
      return notFound();
    }
  } else {
    return notFound();
  }
}
