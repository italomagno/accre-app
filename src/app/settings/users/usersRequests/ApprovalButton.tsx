"use client"
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/ui/use-toast";
import { deleteUserById, saveUserApproval } from "../actions";
import { useState } from "react";

type ApprovalButtonProps = {
    id: string;
}


export function ApprovalButton( {id}:ApprovalButtonProps){
    const {toast} = useToast();
    const [isLoading,setIsLoading] = useState(false);

    async function handleUserSaveApproval(){
        setIsLoading(true)
        const result = await saveUserApproval(id)
        if(result.code !== 200){
            toast({
                title: "Erro ao aprovar usuário",
                description: result.message,
            })
        }else{
            toast({
                title: "Usuário aprovado",
                description: result.message,
            })
        }
        setIsLoading(false)
     
    }
    async function handleDeleteUserApproval(){
        setIsLoading(true)
        const result = await deleteUserById(id)
        if(result.code !== 200){
            toast({
                title: "Erro ao rejeitar usuário",
                description: result.message,
            })
        }else{
            toast({
                title: "Usuário rejeitado",
                description: "Usuário rejeitado com sucesso.",
            })
        }
        setIsLoading(false)
      
    }

    return(
        <div className="flex gap-2">
            <Button disabled={isLoading} variant={"ghost"} onClick={handleUserSaveApproval}>
            Aprovar
        </Button>
            <Button disabled={isLoading} variant="destructive" onClick={handleDeleteUserApproval}>
                Rejeitar
            </Button>
            </div>
        
    )
}