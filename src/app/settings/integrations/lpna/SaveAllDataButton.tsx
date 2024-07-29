"use client"

import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/ui/use-toast";
import { Roster, Shift, User } from "@prisma/client";
import { SaveAllIcon } from "lucide-react";
import { useState } from "react";
import { CreateOrUpdateManyUsers } from "../../users/createUser/actions";
import { createOrUpdateManyRosters } from "../../roster/actions";
import { createOrUpdateManyShifts } from "../../shifts/action";

interface SaveAllDataButtonProps {
    data: Shift[] | Roster[] | User[];
}


export function SaveAllDataButton( { data }: SaveAllDataButtonProps ) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast();

    const handleSaveData = async () => {
        setIsSubmitting(true);

        const isShift = data[0].hasOwnProperty('end');
        const isRoster = data[0].hasOwnProperty('month');
        const isUser = data[0].hasOwnProperty('email');

        if (isShift) {
            const shifts = data as Shift[];
            const response = await createOrUpdateManyShifts(shifts);
            if(response.code === 200){
            toast({
                title:"Sucesso",
                description: response.message,
            });
        }else{
            toast({
                title:"Erro",
                description: response.message,
            });
        }
        }
        

        if (isRoster) {
            const rosters = data as Roster[];
            const response = await createOrUpdateManyRosters(rosters);
            if(response.code === 200){
            toast({
                title:"Sucesso",
                description: response.message,
            });
        }else{
            toast({
                title:"Erro",
                description: response.message,
            });
        }
        }

        if (isUser) {
            const users = data as User[];
            const response = await CreateOrUpdateManyUsers(users);
            if(response.code === 200){
            toast({
                title:"Sucesso",
                description: response.message,
            });
        }else{
            toast({
                title:"Erro",
                description: response.message,
            });
        }
    };
    setIsSubmitting(false);
    };

  return (
    <Button
      type="submit"
      variant={"outline"}
      onClick={handleSaveData}
    disabled={isSubmitting}
    >
      <SaveAllIcon size={24} />
      {isSubmitting? "Salvando..." :  "Salvar Dados"}
    </Button>
  );
}