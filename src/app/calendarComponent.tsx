'use client'
import { Dialog, DialogTrigger } from '@/src/components/ui/dialog';
import {  ErrorTypes} from '@/src/types';
import { DialogComponent } from './DialogComponent';
import { Button } from '@/src/components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { useEffect, useState} from 'react';
import { Calendar } from '../components/ui/calendar';
import { Roster, Shift, WorkDay } from '@prisma/client';
import { getDateFromRoster } from '../lib/utils';
import { handleisSameDate } from '../lib/date';


export function CalendarComponent({ shifts, rosters, workDays }: { shifts: Shift[] | ErrorTypes, rosters: Roster[] | ErrorTypes, workDays:WorkDay[] | ErrorTypes}) {
    const { toast } = useToast()
    const [rostersList, setRostersList] = useState<Roster[]>([])
    const [shiftsList, setShiftsList] = useState<Shift[]>([])
    const [workDaysList, setWorkDaysList] = useState<WorkDay[]>([])

    useEffect(() => {
        if("code" in shifts || "code" in rosters || "code" in workDays){
            if("code" in shifts && shifts.code === 200){
                toast({
                    title:"Sucesso",
                    description: shifts.message,
                })
            }
            if("code" in shifts && shifts.code !== 200){
                toast({
                    title:"Erro",
                    description: shifts.message,
                })
            }
            if("code" in rosters && rosters.code === 200){
                toast({
                    title:"Sucesso",
                    description: rosters.message,
                })
            }
            if("code" in rosters && rosters.code !== 200){
                toast({
                    title:"Erro",
                    description: rosters.message,
                })
        }
        if("code" in workDays && workDays.code === 200){
            toast({
                title:"Sucesso",
                description: workDays.message,
            })
        }
        if("code" in workDays && workDays.code !== 200){
            toast({
                title:"Erro",
                description: workDays.message,
            })
        }
        

    }
    if(!("code" in shifts)) setShiftsList(shifts)
    if(!("code" in rosters)) {
        const rostersWithoutBlockedChanges = rosters.filter(roster=>roster.blockChanges === false)
        if(rostersWithoutBlockedChanges.length > 0 &&
            rostersWithoutBlockedChanges.length !== rosters.length){
            toast({
                title:"Aviso",
                description:"Existem escalas bloqueadas para alterações"
            })
        }
        if(rostersWithoutBlockedChanges.length === 0){
            toast({
                title:"Aviso",
                description:"Todas as escalas estão bloqueadas para alterações"
            })
        }
        setRostersList(rostersWithoutBlockedChanges)
    
    }
    if(!("code" in workDays)) setWorkDaysList(workDays)
    }, [shifts,rosters,workDays]);
    const lastMonthAvailable = rostersList.findLast((roster)=>roster.blockChanges === false)

    return (
        <>
            <Calendar
                mode='default'
                fromMonth={rostersList.length > 0 ? getDateFromRoster(rostersList[0]) : new Date()}
                toMonth={lastMonthAvailable  ? rostersList.length > 0? getDateFromRoster(lastMonthAvailable) : new Date(): new Date()}
                fromYear={rostersList.length > 0 ? rostersList[0].year : new Date().getFullYear()}
                toYear={lastMonthAvailable ? lastMonthAvailable.year : new Date().getFullYear()}
                components={{
                    Day: (props) => 
                    {
                        const workDay = workDaysList.find((workDay)=> handleisSameDate(workDay.day,props.date))
                        const shifts = shiftsList.filter(shift=>workDay?.shiftsId.includes(shift.id))
                        const shiftInThisDay = workDay? shifts.length > 0 ? shifts.map(shift=>shift.name).concat("/") : "-" :"-"
                       
                    return props.date.getMonth() === props.displayMonth.getMonth() ?
                            <div className="flex flex-col gap-3 text-2xl">
                                {props.date.getDate()}
                                <DialogComponent
                                    day={props.date}
                                    shifts={shifts}
                                    shiftInThisDay={shiftInThisDay as string}
                                />
                            </div> 
                            :
                            <div className="flex flex-col gap-3 text-2xl">
                                {props.date.getDate()}
                                <div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant={"ghost"} disabled={true}>
                                            {shiftInThisDay}
                                            </Button>
                                        </DialogTrigger>
                                            {/* <DialogComponent
                                        
                                            /> */}
                                    </Dialog>
                                </div>
                            </div>
                    }
                }}
            />
        </>
    );
}
