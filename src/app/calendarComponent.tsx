'use client'
import { Calendar } from '@/src/components/ui/calendar';
import { Dialog, DialogTrigger } from '@/src/components/ui/dialog';
import { ShiftsStatusProps, optionsProps } from '@/src/types';
import { DialogComponent } from './DialogComponent';
import { Button } from '@/src/components/ui/button';

export function CalendarComponent({ proposal, options,shiftsStatus }: { proposal: string, options: optionsProps[],shiftsStatus:ShiftsStatusProps }) {

    function handleProposal(DayOfMonth: number) {
        const proposals = proposal ? proposal.split(",") : [];
        const matchingProposal = proposals.find((prop: any) => {
            const [day, shift] = prop.split(":");
            return day === DayOfMonth.toString();
        });
        return matchingProposal ? matchingProposal.split(":")[1] : "-";
    }

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
        </>
    );
}
