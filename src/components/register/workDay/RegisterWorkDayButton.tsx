"use client"

import { generateUniqueKey } from "@/src/lib/utils"
import { Button } from "../../ui/button"
import { WorkDay } from "@prisma/client"
import { useToast } from "../../ui/use-toast"
import { registerOrUpdateManyWorkDays } from "./action"
import { useRouter } from "next/navigation"

type WorkDayButton = {
    workDays: WorkDay[]
    rosterId: string,
    isAdmin?: boolean
    hasRestrictionsToSave: boolean

}

export function RegisterWorkDayButton({workDays,rosterId, isAdmin,hasRestrictionsToSave = true}: WorkDayButton){
  const { toast } = useToast()
  const router = useRouter()
console.log(rosterId)
  async function handleSaveProposal(){
    const response = await registerOrUpdateManyWorkDays(workDays,rosterId,hasRestrictionsToSave)
    if("code" in response){
      if(response.code === 200){
        toast({
          title:"Sucesso",
          description: response.message,
        })
        isAdmin && router.push("/")
      }
      else{
        toast({
          title:"Erro",
          description: response.message,
        })
      }
    }
  }

    return(
        <Button
      
        className="w-full"
            key={generateUniqueKey()}
                        variant="default"
                        onClick={handleSaveProposal}
                        disabled={!rosterId}
                      >
                        <span className="w-full">Salvar Escala</span>
        </Button>
    )

}