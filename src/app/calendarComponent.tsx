'use client'
import { Calendar } from '@/src/components/ui/calendar';
import { Dialog, DialogTrigger } from '@/src/components/ui/dialog';
import { Error, ProposalValues, ShiftsStatusProps, optionsProps, proposalSchema } from '@/src/types';
import { DialogComponent } from './DialogComponent';
import { Button } from '@/src/components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { useEffect, useState,  } from 'react';
import { handleSaveShifts } from './lancamento/_actions';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


export function CalendarComponent({ proposal, options,shiftsStatus,}: { proposal: string, options: optionsProps[],shiftsStatus:ShiftsStatusProps }) {
    //@ts-ignore
    const { toast } = useToast()
    const [response,setResponse] = useState<Error | Error[] | null >(null)
    const [isPending, setIsPeding] = useState(false)

        

    function handleProposal(DayOfMonth: number) {
        const proposals = proposal ? proposal.split(",") : [];
        const matchingProposal = proposals.find((prop: any) => {
            const [day, shift] = prop.split(":");
            return day === DayOfMonth.toString();
        });
        return matchingProposal ? matchingProposal.split(":")[1] : "-";
    }

    const form = useForm<ProposalValues>({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
          proposal: proposal,
        },
      });



    useEffect(() => {
        if(response){
        if((response as unknown as Error).error){
            toast({
                title: "Erro",
                description:((response as unknown as Error).error)
            })
            return 
        }
        if((response as unknown as Error[])[0].error){
            (response as unknown as Error[]).map(error=>(
                toast({
                    title: "Erro",
                    description:error.error
                })
            ))
            return
        }
        toast({
            title: "Sucesso!",
            description: "Turnos salvos com sucesso."
        })
    }

    setIsPeding(false)
    setResponse(null)

    }, [response]);


    
    return (
        <>
            <Calendar
                mode='default'
                className='text-lg'
                styles={{
                    months: { 
                        fontSize: "1.5rem",
                        lineHeight: "2rem"
                    },
                    row: { 
                        fontSize: "1.5rem",
                        lineHeight: "2rem",
                    },
                    head_cell: { 
                        width: "50px",
                        height: "50px",
                        fontSize: "1.5rem",
                        lineHeight: "2rem"
                    },
                    cell: { 
                        width: "50px",
                        height: "75px",
                    },
                    
                }}
                components={{
                    Day: (props) => 
                    {
                    return props.date.getMonth() === props.displayMonth.getMonth() ?
                            <div className="flex flex-col gap-3 text-2xl">
                                {props.date.getDate()}
                                <div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant={"ghost"}>
                                                {handleProposal(props.date.getDate())? handleProposal(props.date.getDate()): "-"}
                                            </Button>
                                        </DialogTrigger>
                                            <DialogComponent
                                                day={props.date.getDate().toString()}
                                                proposal={proposal}
                                                options={options}
                                                shiftsStatus={shiftsStatus}
                                            />
                                    </Dialog>
                                </div>
                            </div> 
                            :
                            <Button disabled={true} variant={"ghost"}>{props.date.getDate()}</Button>;
                    }
                }}
            />

       <Button disabled={isPending} onClick={async()=>{
        setIsPeding(true)
        const result = (await handleSaveShifts(proposal))
        console.log(result)
        setResponse(result)
       }}variant="destructive" className='w-full max-w-screen-sm bg-green-400 hover:bg-green-400/40' type='submit'>
    Salvar Proposição
  </Button>

        </>
    );
}
