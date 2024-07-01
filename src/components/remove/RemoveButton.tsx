"use client"

import {  X } from "lucide-react"
import { useToast } from "../ui/use-toast";
import { ErrorTypes } from "@/src/types";
import { Button } from "../ui/button";
import { PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Popover } from "../ui/popover";

type RemoveButtonProps = {
    id: string;
    handleRemoveItem:(id: string) => Promise<ErrorTypes>;
}


export function RemoveButton({id,handleRemoveItem}: RemoveButtonProps) {
    const {toast} = useToast()

    async function handleRemove(){
        const result = await handleRemoveItem(id)
        if("code" in result && result.code === 200){
            toast({
                title: "Sucesso",
                description: result.message,
            })
        }else{
            toast({
                title: "Erro",
                description: result.message,
            })
        }
    }

    return (
     
      <Popover>
        <PopoverTrigger>
          <Button variant={"destructive"} size={"icon"}>

          <X/>
          </Button>
        </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
      Tem certeza que deseja remover?
      <Button onClick={handleRemove} variant="destructive">Sim</Button>
      </PopoverContent>
      </Popover>
      
  
  

    )
}