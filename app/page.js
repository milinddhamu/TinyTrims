"use client"
import { ModeToggle } from '@/components/ModeToggle'
import { CollapsibleDemo } from '@/components/collapsible'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator"
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
import handleStoreUserData from '@/controllers/user';
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useTheme } from 'next-themes';
import Loading from '@/components/loading'
import { Skeleton } from "@/components/ui/skeleton";

const initialMetaDataState = {
  title: '',
  description: '',
  opengraphImageLink: '',
};

export default function Home() {
  const { toast } = useToast(); // notification toaster
  const [parent] = useAutoAnimate(/* optional config */) // auto animation function using ref
  const { data : session } = useSession(); // user session data from next-auth
  const [isTinyLinkLoading, setIsTinyLinkLoading] = useState(false); // loading when pressed button to trim
  const [destinationLinkInput , setDestinationLinkInput] = useState(''); // long url input
  const [metaDataState, setMetaDataState] = useState(initialMetaDataState); // metedata form state
  const [activeButtonIndex, setActiveButtonIndex] = useState(null); // edit link state indexing so only one stays editable
  const handleConfigureLink = (index) => {
    setActiveButtonIndex((prevIndex) => (prevIndex === index ? null : index));
  }; // function to activate and de activate edit option of a index link so only when gets editable mode
  const [userData , setUserData] = useState(null); // data fetched from mongoDB
  const domainRegex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;
  const handleDestinationLinkInput = (e) => {
    const inputValue = e.target.value;
    setDestinationLinkInput(inputValue);
  };
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // adding delay according to param

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
      if (!domainRegex.test(destinationLinkInput)) {
        toast({
          title: "Please provide a valid link.",
        });
      } else {
        if (session && session.user) {
          setIsTinyLinkLoading(true);
  
          // Check if the destinationLinkInput is a new domain and if length of domains >= 5
          const userDomains = userData?.domains || [];
          const isNewDomain = userDomains.some(domain => domain.destination === destinationLinkInput);
          const hasMaxDomains = userDomains.length >= 5;
  
          if (!isNewDomain && hasMaxDomains) {
            toast({
              title: "Limit reached!",
              description: "Maximum number of domains (5) reached.",
            });
          } else {
            // Check if destinationLinkInput is already present and has 5 links
            const existingDomain = userDomains?.find(domain => domain.destination === destinationLinkInput);
            const hasMaxLinks = existingDomain && existingDomain?.links.length >= 5;
  
            if (hasMaxLinks) {
              toast({
                title:"Limit reached!",
                description: `Maximum number of links (5) reached for ${destinationLinkInput}.`,
              });
            } else {
              await handleStoreUserData({ session, destinationLinkInput, metaDataState });
              toast({
                title: `Generated TinyId `,
                description:`for ${destinationLinkInput}`
              });
              await delay(1000);
              await fetchUserData(session.user.email);
            }
          }
  
          setIsTinyLinkLoading(false);
          setDestinationLinkInput('');
        } else {
          toast({
            title: "Sign in to continue",
            description: "You can sign in with Google.",
          });
        }
      }
    } else {
      toast({
        title: "Please enter your link.",
      });
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
  }; // function to push data to database inside user object
  return (
    <>
    <div className="flex flex-col min-h-screen h-screen justify-start w-full items-center p-4">
      <div className="flex w-full justify-center items-center h-48 min-h-48">
        <h1 className={`font-bold text-4xl text-transparent bg-clip-text bg-[radial-gradient(_var(--tw-gradient-stops))] from-white to-black animate-text tracking-tighter m-1`}>Tiny Trims</h1>
      </div>
    <div className="flex flex-col gap-2 items-start w-full max-w-xl">
      <div className="flex flex-row gap-2 items-center w-full">
        {/* Theme toggle switch */}
      <ModeToggle />
      {(session && session.user) ? 
      <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={session?.user.image} alt="user" />
                <AvatarFallback><Skeleton className="h-full w-full duration-350" /></AvatarFallback>
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
          className={domainRegex.test(destinationLinkInput) ? "text-green-400" : "text-red-400"} 
          value={destinationLinkInput} 
          onChange={handleDestinationLinkInput} />
        </div>
            <PopoverDemo
              metaDataState={metaDataState}
              handleMetaDataChange={handleMetaDataChange}
            />  
                <Button onClick={handleFormSubmit} disabled={isTinyLinkLoading}>
                {isTinyLinkLoading ? 
                <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                &nbsp;
                <p className="animate-pulse">Trimming</p>
                </>
                :
                "Shorten"
              }
                
                </Button>
      </div>
      <div className="flex flex-col text-xs">
        <h3>Max url limit: 5</h3>
        <h3>Max link limit (per url): 5</h3>
      </div>
      <Separator className="my-1" />
        <div className="flex flex-col w-full gap-3 mb-32">
              {(session && session.user) && (reverseMappedLinks?.length > 0 ?
                reverseMappedLinks.map((domain,index)=>(
                <CollapsibleDemo 
                domain={domain} 
                key={`${domain.destination}-${index}`} 
                active={activeButtonIndex === index}
                onConfigureLink={() => handleConfigureLink(index)}
                deleteLinkFunction={postData}
              />
              )) : <Loading />)
            }            
            {(reverseMappedLinks?.length === 0 && userData?.tag && session) && <h1 className="w-full text-center">Not even one link is made tiny.</h1>}
        </div>
      {!(session && session.user) && <span className="flex flex-col gap-2 w-full"><h1 className="font-semibold text-center">Please sign in to continue.</h1><h1 className="w-full text-center text-sm">Currently sign-in with Google is only supported. </h1></span>}
    </div>
    </div>
    </>
  )
}
