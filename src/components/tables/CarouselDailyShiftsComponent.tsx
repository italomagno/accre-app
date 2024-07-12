"use client";
import { generateUniqueKey, getMonthFromRoster } from "@/src/lib/utils";
import { Roster } from "@prisma/client";
import { NavigateBetweenDaysButton } from "./NavigateBetweenDaysButton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import React, { useEffect, useState } from "react";
import { getShiftsFilteredPerDay } from "../update/shift/action";
import { useToast } from "../ui/use-toast";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";



type CarouselDailyShiftsComponentProps = {
    roster: Roster
    day: number
}

export function CarouselDailyShiftsComponent({day,roster}: CarouselDailyShiftsComponentProps){
    const {toast} = useToast()
    const [shifts, setShifts]= useState<{
        Turno: string;
        Escalado: {
            name: string;
        }[];
    }[]>([])

    async function getShifts(){
        const response = await getShiftsFilteredPerDay(roster,day)
        if('code' in response){
            toast({
                title: 'Erro',
                description: response.message,
            })
        }else{
            setShifts(response)
        }

    }

    useEffect(() => {
        getShifts()
    },[])

    const headers = Object.keys(shifts[0] ?? {})

    return (
        <div  className="flex flex-col gap-5">
        <div className='my-14 w-full flex items-center justify-between px-7'>
        <NavigateBetweenDaysButton 
          roster={roster}
          type="left"
        />
        <div>
          <p className="text-lg">{ `Escala do dia ${day} do mês de ${getMonthFromRoster(roster) ?? 'desconhecido'} de ${roster.year}`}</p>
        </div>
        <NavigateBetweenDaysButton 
          roster={roster}
          type="right"
        />
      </div>
      <ScrollArea  key={generateUniqueKey()} className='max-h-[dvh] w-full overflow-auto '>
      <Table>
  <TableCaption>{shifts.length <= 0 ? `Ainda não há escalados para o dia ${day}`:`Lista de escalados para o dia ${day}`}</TableCaption>
  {
        shifts.length > 0 &&
    <>
  <TableHeader>
    <TableRow>
        {
            headers.map(header=>(
                <TableHead key={generateUniqueKey()}>{header}</TableHead>
            ))
        }
    </TableRow>
  </TableHeader>
  <TableBody>
        {
            shifts.map(shift=>(
                <React.Fragment key={generateUniqueKey()}>
                 {
                                shift.Escalado.map(escalado=>(
                <TableRow key={generateUniqueKey()}>
                    <TableCell>{shift.Turno}</TableCell>
                    <TableCell>
                           
                            {escalado.name}
                                
                    </TableCell>
                </TableRow>
                ))
            }
                </React.Fragment>

            ))
               
        
        }
  </TableBody>
  </>

  }
</Table>
<ScrollBar  orientation='vertical'/>

</ScrollArea>

      </div>
      
    )
}