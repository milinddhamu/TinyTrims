"use client"
import { ModeToggle } from '@/components/ModeToggle'
import { CollapsibleDemo } from '@/components/collapsible'
import { ToggleOutline } from '@/components/SettingsToggle'
import { CardWithForm } from '@/components/ui/CardWithForm'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {useState, useEffect} from "react";
import { signIn, signOut } from "next-auth/react"
import {useSession} from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PopoverDemo } from '@/components/popover'
import {nanoid} from 'nanoid';
import handleStoreUserData from '@/controllers/user';
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios';

const initialMetaDataState = {
  title: '',
  description: '',
  opengraphImageLink: '',
};

export default function Home() {
  const { toast } = useToast();
  const [toggleAdvancedSettings,setToggleAdvancedSettings] = useState(false);
  const { data : session } = useSession();
  const [destinationLinkInput , setDestinationLinkInput] = useState('');
  const [metaDataState, setMetaDataState] = useState(initialMetaDataState);

  const [userData , setUserData] = useState(null);
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.?){1,}([a-zA-Z]{2,})$/;
  const handleDestinationLinkInput = (e) => {
    const inputValue = e.target.value;
    setDestinationLinkInput(inputValue);
  };
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchUserData = async (email) => {
    try {
      const res = await axios.get(`/api/users/${encodeURIComponent(email)}`);
      if (res.data.user !== null) {
        setUserData(res.data.user);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async () => {
    if (destinationLinkInput !== "") {
      if (domainRegex.test(destinationLinkInput)) {
        toast({
          title: "Please provide valid link.",
        })
      } else {
        if(session && session.user){
          await handleStoreUserData({session ,destinationLinkInput,metaDataState });
          toast({
            title: `Generated a shortId for ${destinationLinkInput}`,
          });
          await delay(1000);
          await fetchUserData(session.user.email);
          setDestinationLinkInput('')
          
        } else {
          toast({
            title: "SignIn to continue",
            description : "you can sign-in with google"
          })
        }
      }
    } else {
      toast({
        title: "Please enter your link.",
      })
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (session && session.user) {
        await fetchUserData(session.user.email);
      }
    };
  
    fetchData();
  }, [session]);
  const reverseMappedLinks = [...(userData?.domains || [])].reverse();

  const handleMetaDataChange = (e) => {
    const { name, value } = e.target;
    setMetaDataState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  console.log(reverseMappedLinks)
  return (
    <div className="flex flex-col h-full justify-start w-full items-center p-4">
      <div className="flex w-full h-48"></div>
    <div className="flex flex-col gap-2 items-start w-full max-w-xl">
      <div className="flex flex-row gap-2 items-center">
      <ModeToggle />
      {(session && session.user) ? 
      <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={session.user.image} alt="user" />
                <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>{session?.user.name || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Recent links</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </> :         <Button onClick={()=> signIn("google")}>SignIn</Button>

      }
      </div>
      <div className="flex flex-row gap-2 w-full relative">
        <div className="w-full">
          <Input 
          placeholder="https://example.com" 
          className={domainRegex.test(destinationLinkInput) ? "text-red-400" : "text-green-400"} 
          value={destinationLinkInput} 
          onChange={handleDestinationLinkInput} />
        </div>
            <PopoverDemo
              metaDataState={metaDataState}
              handleMetaDataChange={handleMetaDataChange}
            />  
                <Button onClick={handleFormSubmit}>Shorten</Button>
      </div>
      {userData && 
        <>
          <Separator className="my-1" />
            {reverseMappedLinks.map((domain,index)=>(
              <CollapsibleDemo domain={domain} key={`${domain.destination}-${index}`} />
            ))}
        </>
      }
      {!(session && session.user) && <h1>Please Sign In to continue ..</h1>}
    </div>
    </div>
  )
}
