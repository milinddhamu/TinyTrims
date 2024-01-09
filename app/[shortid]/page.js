import { notFound, redirect } from "next/navigation";

async function getLinkData({ shortid }) {
  try {
    const options = { method: 'GET' };
    const response = await fetch(`/api/links/${encodeURIComponent(shortid)}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default async function Page({ params }) {
    const shortid = params.shortid;
    const res = await getLinkData({ shortid });
    const nonNullLink = res?.link.find(entry => entry !== null);
    if (nonNullLink) {
      const destination = nonNullLink.destination;
      if (destination) {
          return redirect(destination);
      } else {
          return notFound();
      }
  } else {
      return notFound();
  }
}
