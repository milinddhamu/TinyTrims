"use client"

import * as React from "react"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { CopyIcon } from "@radix-ui/react-icons"
import { CheckCircledIcon } from "@radix-ui/react-icons"
import { ExclamationTriangleIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { TrashIcon , Pencil1Icon, ArrowTopRightIcon } from "@radix-ui/react-icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {useRouter} from 'next/navigation'
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "next-themes"
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import NextLink from "next/link";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { motion, animate,useMotionValue, useMotionTemplate } from "framer-motion";

export function CollapsibleDemo({ domain, active, onConfigureLink ,deleteLinkFunction}) {
  const router = useRouter();
  const [parent] = useAutoAnimate(/* optional config */)
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedLinkIds, setSelectedLinkIds] = React.useState([]);
  const { theme, setTheme } = useTheme()
  const linksArray = [...domain.links];
  const firstLink = linksArray.shift();
  const handleConfigureLink = () => {
    setIsOpen(true);
    onConfigureLink(); // Notify the parent component
  };
    const handleCheckboxChange = (linkId) => {
      setSelectedLinkIds((prevIds) => {
        if (prevIds.includes(linkId)) {
          // Remove the ID if already present
          return prevIds.filter((id) => id !== linkId);
        } else {
          // Add the ID if not present
          return [...prevIds, linkId];
        }
      });
  };
  React.useEffect(()=>{
    if(active) {
      toast({
        title: `${selectedLinkIds.join(" | ")} -> selected tiny link id's.`,
      });
    }
  },[selectedLinkIds])

  const handleDeleteLinksFromDomain = async() => {
    if(selectedLinkIds.length > 0){
      await deleteLinkFunction(selectedLinkIds);
      setSelectedLinkIds([])
      setIsOpen(true);
      toast({
        variant: "destructive",
        title: `Deleted tiny id's - ${selectedLinkIds.join(" | ")}`,
      });
    } else {
      toast({
        title: `Please select tiny link id to continue`,
      });
    }
  };
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const handleMouseMove = ({clientX,clientY,currentTarget}) => {
    let { left,top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  const shadowColor = theme === "dark" ? "rgb(255 255 255/0.15)" : "rgb(0 0 0/0.15)";
  return (
    <Card className={`w-full p-2 rounded-[.5em] relative group bg-transparent`} onMouseMove={handleMouseMove}>
       <motion.div
          className="pointer-events-none absolute opacity-10 group-hover:opacity-50 transition-all ease-in duration-300" 
          style={{ 
            background: useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, ${shadowColor},transparent 80%)` , 
            borderRadius:"8px",inset:"-1px",zIndex:"-10"
          }}/>
       
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 pl-2">
      <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="truncate-text ">
                <p className="text-sm font-semibold">
                  {domain.destination}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{domain.destination}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        <div className="flex flex-row items-center gap-2">
        {(active && selectedLinkIds) && <Button 
          variant={selectedLinkIds?.length > 0 ? "destructive" : "outline"} 
          size="sm" 
          onClick={handleDeleteLinksFromDomain}>
            <TrashIcon />
        </Button>}
        <Button 
          variant={"outline"} 
          size="sm" 
          onClick={handleConfigureLink}>
            {active ? "Cancel" : "Configure" }
        </Button>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" disabled={!(domain?.links.length > 1)}>
            {/* <Pencil1Icon className="h-4 w-4" /> */}
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        
        </div>
      </div>

      <div className={`rounded-md border pl-4 font-mono text-sm shadow-sm flex flex-row justify-between items-center p-1 ${selectedLinkIds?.includes(firstLink?.id) && active ? theme === "light" ? "border-black" : "border-white" : ""}`}>
      <div className="flex flex-row items-center gap-4 truncate ">
          { active && 
              <Checkbox
                id="firstLink"
                checked={selectedLinkIds?.includes(firstLink?.id)}
                onCheckedChange={() => handleCheckboxChange(firstLink?.id)}
              /> }
        <div className={`${firstLink?.id ? "":"text-red-500"} py-1.5`}>
        {firstLink?.id || "All links expired"}
        </div>
        </div>
          <div className="flex flex-row items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><EyeOpenIcon className="" /></TooltipTrigger>
              <TooltipContent>
                <p>Views</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {firstLink?.views.length}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CheckCircledIcon className="h-4 w-4 text-green-500 mr-1.5" />
                </TooltipTrigger>
              <TooltipContent className="bg-green-400">
                <p>It&apos;s Live!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
                        
         {firstLink && <>
            <CopyToClipboard 
              text={`https://tinytrims.vercel.app/${firstLink?.id}`} 
              onCopy={()=>{
                  toast({
                  title: `${firstLink?.id} copied with link successfully`,
                })
              }}
              className="opacity-50 hover:opacity-100 transition-opacity duration-300"
              >
                  <Button variant="ghost" size="xs">
                    <CopyIcon /> 
                  </Button>
            </CopyToClipboard>
          
          <Button variant="ghost" size="xs" className="p-1.5" asChild>
          <NextLink href={`/${firstLink.id}`}>
            <ArrowTopRightIcon className="h-4 w-4" />
          </NextLink>
        </Button> </> }
        </div>
        </div>
      
      {linksArray && 
      <CollapsibleContent className="space-y-2" ref={parent}>
          {linksArray?.map((link,index)=>(
        <div key={`${link.id}-${index}`} className={`rounded-md border pl-4 font-mono text-sm shadow-sm flex flex-row justify-between items-center ${link?.id ? "":"text-red-500"} p-1 ${selectedLinkIds?.includes(link?.id) && active ? theme === "light" ? "border-black" : "border-white" : ""}`}>
          <div className="flex flex-row items-center gap-4 truncate ">
          { active && 
                    <Checkbox
                      id={`link-${link.id}`}
                      checked={selectedLinkIds?.includes(link.id)}
                      onCheckedChange={() => handleCheckboxChange(link.id)}
                    /> }
            <div>
              {link?.id || "Link expired"}
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><EyeOpenIcon className="" /></TooltipTrigger>
              <TooltipContent>
                <p>Views</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {link?.views.length}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CheckCircledIcon className="h-4 w-4 text-green-500 mr-1.5" />
                </TooltipTrigger>
              <TooltipContent className="bg-green-400">
                <p>It&apos;s Live!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
              <TooltipContent className="bg-yellow-400">
                <p>It&apos;s about to end.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
                        
          {link && <>
          <CopyToClipboard 
            text={`https://tinytrims.vercel.app/${link?.id}`} 
            onCopy={()=> {
              toast({
              title: `${link?.id} copied with link successfully`,
                })
               }}
            className="opacity-50 hover:opacity-100 transition-opacity duration-300"
            >
            <Button variant="ghost" size="xs">
              <CopyIcon /> 
            </Button>
          </CopyToClipboard>

          <Button variant="ghost" size="xs" className="p-1.5" asChild>
          {/* <TrashIcon className="h-4 w-4 text-red-500" /> */}
          <NextLink href={`/${link.id}`}>
            <ArrowTopRightIcon className="h-4 w-4" />
          </NextLink>
        </Button> </>}
        </div>
        </div>
         ))}
      </CollapsibleContent> }
    </Collapsible>
    </Card>

  )
}
