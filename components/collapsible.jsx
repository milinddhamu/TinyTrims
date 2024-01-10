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


export function CollapsibleDemo({domain}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const linksArray = [...domain.links];
  const firstLink = linksArray.shift();
  const handleVisitLink = (link) => router.push(`/${encodeURIComponent(link)}`)
  return (
    <Card className="w-full p-2 rounded-[.5em]">
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 pl-2">
        <h4 className="text-sm font-semibold">
          {domain.destination}
        </h4>
        {(domain?.links.length > 1) && <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {/* <Pencil1Icon className="h-4 w-4" /> */}
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>}
      </div>

      <div className="rounded-md border pl-4 font-mono text-sm shadow-sm flex flex-row justify-between items-center">
          <div className={`${firstLink?.id ? "":"text-red-500"}`}>
        {firstLink?.id || "All links expired"}
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
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                </TooltipTrigger>
              <TooltipContent className="bg-green-400">
                <p>It&apos;s Live!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
              <TooltipContent className="bg-yellow-400">
                <p>It&apos;s about to end.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
                        
         {firstLink && <Button variant="ghost" size="xs" onClick={() => handleVisitLink(firstLink.id)} className="m-1 p-1.5">
          {/* <TrashIcon className="h-4 w-4 text-red-500" /> */}
            <ArrowTopRightIcon className="h-4 w-4" />
        </Button> }
        </div>
        </div>
      
      {linksArray && 
      <CollapsibleContent className="space-y-2">
          {linksArray?.map((link,index)=>(
        <div key={`${link.id}-${index}`} className={`rounded-md border pl-4 font-mono text-sm shadow-sm flex flex-row justify-between items-center ${link?.id ? "":"text-red-500"}`}>
          <div>
        {link?.id || "Link expired"}
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
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                </TooltipTrigger>
              <TooltipContent className="bg-green-400">
                <p>It&apos;s Live!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
              <TooltipContent className="bg-yellow-400">
                <p>It&apos;s about to end.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
                        
          {link && <Button variant="ghost" size="xs" onClick={() => handleVisitLink(link.id)} className="m-1 p-1.5">
          {/* <TrashIcon className="h-4 w-4 text-red-500" /> */}
            {/* <CopyIcon className="h-4 w-4" /> */}
            <ArrowTopRightIcon className="h-4 w-4" />
        </Button> }
        </div>
        </div>
         ))}
      </CollapsibleContent> }
    </Collapsible>
    </Card>

  )
}
