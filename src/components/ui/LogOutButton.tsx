"use client"
import { handleLogOut } from "@/src/app/login/_actions"
import { Button } from "./button"
import { Power} from "lucide-react";
import { useRouter } from "next/navigation";


export function LogOutButton(){
    const router = useRouter()
    return(
        <Button 
        variant="ghost"
        onClick={
            async function handleLogOff(){
              await handleLogOut()
                router.push("/login")
                  }}> 
                    <Power className="h-4 w-4 mr-2 text-lg" />
                          {`Sair `}😢

        </Button>
    )

}