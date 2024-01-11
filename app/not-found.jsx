import NextLink from "next/link";
import { Separator } from "@/components/ui/separator"
export default function Custom404(){
  return (
    <div className={`flex flex-col h-screen max-h-screen w-full justify-between gap-4 items-center invert-0 p-4`}>
      <div className="flex flex-1 flex-col gap-4 justify-center items-center">
      <h1 className="font-black text-6xl">404</h1>
      <Separator className="mt-4" />
      <span className="flex flex-row gap-2 w-full justify-center">
      <h1>Generate tiny links <NextLink href="/" id="home-link" className="text-blue-500 hover:underline">here</NextLink></h1>
      </span>
      </div>
      <span className="flex flex-row gap-2 w-full justify-center">
        <NextLink id="milinddhamu" href="https://github.com/milinddhamu"><h1 className="text-blue-500 hover:underline">My Github</h1></NextLink>
        <p>&#8226;</p>
        <NextLink id="TinyTrims" href="https://github.com/milinddhamu/TinyTrims"><h1 className="text-blue-500 hover:underline">Source code</h1>
        </NextLink>
      </span>
    </div>
  );
}