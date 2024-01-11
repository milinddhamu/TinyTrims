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
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useTheme } from 'next-themes'
const initialMetaDataState = {
  title: '',
  description: '',
  opengraphImageLink: '',
};


export default function Home() {
  const { toast } = useToast();
  const { theme } = useTheme()
  const [parent] = useAutoAnimate(/* optional config */)
  const [toggleAdvancedSettings,setToggleAdvancedSettings] = useState(false);
  const { data : session } = useSession();
  const [destinationLinkInput , setDestinationLinkInput] = useState('');
  // const [selectedLinkIds, setSelectedLinkIds] = useState([]);
  const [metaDataState, setMetaDataState] = useState(initialMetaDataState);
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const handleConfigureLink = (index) => {
    setActiveButtonIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const [userData , setUserData] = useState(null);
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.?){1,}([a-zA-Z]{2,})$/;
  const handleDestinationLinkInput = (e) => {
    const inputValue = e.target.value;
    setDestinationLinkInput(inputValue);
  };
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchUserData = async (email) => {
    try {
      const res = await axios.get(`https://tinytrims.vercel.app/api/users/${encodeURIComponent(email)}`);
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
      if (session && session.user && userData === null) {
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
  // const onCheckboxChange = (linkId) => {
  //   setSelectedLinkIds((prevIds) => {
  //     if (prevIds.includes(linkId)) {
  //       // Remove the ID if already present
  //       return prevIds.filter((id) => id !== linkId);
  //     } else {
  //       // Add the ID if not present
  //       return [...prevIds, linkId];
  //     }
  //   });
  // };

  const postData = async(linkIds) => {
    const options = {
      method: 'POST',
      url: `/api/remove/${encodeURIComponent(userData?.tag)}`,
      data: { linkIds }
    }; 
    try {
      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
      await delay(1000);
      await fetchUserData(session.user.email);
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  }
  return (
    <div className="flex flex-col h-full justify-start w-full items-center p-4">
      <div className="flex w-full justify-center items-center h-48 ">
        <h1 className={`font-bold text-4xl text-transparent bg-clip-text bg-[radial-gradient(_var(--tw-gradient-stops))] from-white to-black animate-text tracking-tighter m-1`}>tiny trims</h1>
      </div>
    <div className="flex flex-col gap-2 items-start w-full max-w-xl">
      <div className="flex flex-row gap-2 items-center w-full">
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
              <DropdownMenuItem>Profile -dummy</DropdownMenuItem>
              <DropdownMenuItem>Recent links -dummy</DropdownMenuItem>
              <DropdownMenuItem>Settings -dummy</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=>signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </> :         <Button id="sign-in-with-google" onClick={()=> signIn("google")}>Sign In</Button>

      }
      </div>
      <div className={`flex flex-row gap-2 w-full relative ${session ? "":"pointer-events-none hover:cursor-not-allowed"}`}>
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
      <div className="flex flex-col text-xs">
        <h3>Max url limit: 5</h3>
        <h3>Max link limit (per url): 5</h3>
      </div>
      <Separator className="my-1" />
      {userData && 
        <div ref={parent} className="flex flex-col w-full gap-3">
            {reverseMappedLinks?.length > 0 ?  reverseMappedLinks.map((domain,index)=>(
              <CollapsibleDemo 
              domain={domain} 
              key={`${domain.destination}-${index}`} 
              active={activeButtonIndex === index}
              onConfigureLink={() => handleConfigureLink(index)}
              deleteLinkFunction={postData}
              // selectedLinkIds={selectedLinkIds} 
              // onCheckboxChange={onCheckboxChange}
            />
            )) : <h1 className="w-full text-center">Not even one link is made tiny.</h1>}
        </div>
      }
      {!(session && session.user) && <span className="flex flex-col gap-2 w-full"><h1 className=" text-center">Please sign in to continue.</h1><h1 className="w-full text-center text-sm">currently Google provider is only supported. </h1></span>}
    </div>
    </div>
  )
}
