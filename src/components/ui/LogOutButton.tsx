"use client"
import { handleLogOut } from "@/src/app/login/_actions"
import { Button } from "./button"
import { Power} from "lucide-react";


export function LogOutButton(){
    return(
        <Button 
        variant="ghost"
        onClick={
            async function handleLogOff(){
              await handleLogOut()
                  }}> 
                    <Power className="h-4 w-4 mr-2" />
                          Logout

        </Button>
    )

}