"use client"
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/ui/use-toast";
import { deleteUserById, saveUserApproval } from "../actions";

type ApprovalButtonProps = {
    id: string;
}


export function ApprovalButton( {id}:ApprovalButtonProps){
    const {toast} = useToast();

    async function handleUserSaveApproval(){
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
     
    }
    async function handleDeleteUserApproval(){
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
      
    }

    return(
        <div className="flex gap-2">
            <Button variant={"ghost"} onClick={handleUserSaveApproval}>
            Aprovar
        </Button>
            <Button variant="destructive" onClick={handleDeleteUserApproval}>
                Rejeitar
            </Button>
            </div>
        
    )
}