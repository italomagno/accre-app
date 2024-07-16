"use client"

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getUsersThatIsNotApproved } from "./settings/users/actions";

export async function NotificationsComponent() {
    const router = useRouter();
    const [numberOfNotifications,setNumberOfNotifications] = useState(0);

    async function getUsers(){
        const result = await getUsersThatIsNotApproved();
        if("code" in result){
            setNumberOfNotifications(0)
            return
        }
         setNumberOfNotifications(result.length)
    }
    useEffect(() => {
     getUsers()
    },[])
  return (
    <>
    {
    
    numberOfNotifications>0 && <Button variant={"outline"} size={"icon"}  onClick={()=>router.push("/settings/users/usersRequests")}>
        <BellIcon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${numberOfNotifications>0 && "animate-pulse"}`} />
  </Button>
  }
  </>
  );
}