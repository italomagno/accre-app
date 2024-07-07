"use client"

import { generateUniqueKey } from "@/src/lib/utils"
import { Button } from "../../ui/button"
import { WorkDay } from "@prisma/client"
import { useToast } from "../../ui/use-toast"
import { registerOrUpdateManyWorkDays } from "./action"

type WorkDayButton = {
    workDays: WorkDay[]
}

export function RegisterWorkDayButton({workDays}: WorkDayButton){
  const { toast } = useToast()

  async function handleSaveProposal(){
    const response = await registerOrUpdateManyWorkDays(workDays)
    if("code" in response){
      if(response.code === 200){
        toast({
          title:"Sucesso",
          description: response.message,
        })
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
                      >
                        <span className="w-full">Salvar Escala</span>
        </Button>
    )

}