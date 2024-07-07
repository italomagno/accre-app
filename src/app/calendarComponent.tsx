'use client'
import {  ErrorTypes} from '@/src/types';
import { DialogComponent } from './DialogComponent';
import { useToast } from '../components/ui/use-toast';
import { useEffect, useState} from 'react';
import { Calendar } from '../components/ui/calendar';
import { Roster, Shift, WorkDay } from '@prisma/client';
import { getDateFromRoster } from '../lib/utils';
import { handleisSameDate } from '../lib/date';
import { RegisterWorkDayButton } from '../components/register/workDay/RegisterWorkDayButton';


export function CalendarComponent({ shifts, rosters, workDays }: { shifts: Shift[] | ErrorTypes, rosters: Roster[] | ErrorTypes, workDays:WorkDay[] | ErrorTypes}) {
    const { toast } = useToast()
    const [rostersList, setRostersList] = useState<Roster[]>([])
    const [shiftsList, setShiftsList] = useState<Shift[]>([])
    const [ workDaysList, setWorkDaysList] = useState<WorkDay[]>([])

    function handleUpdateWorkDay(workDay: WorkDay){
        const alreadyExists = workDaysList.find((workDayInList)=>handleisSameDate(workDayInList.day,workDay.day))
        if(alreadyExists){
            const updatedWorkDays = workDaysList.map((workDayInList)=>{
                if(handleisSameDate(workDayInList.day,workDay.day)){
                    return workDay
                }
                return workDayInList
            })
            setWorkDaysList(updatedWorkDays)
        }
        else{
            setWorkDaysList([...workDaysList,workDay])
        }


    }
        


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
    if(!("code" in workDays)){ 
        setWorkDaysList(workDays)
    }
    }, [shifts,rosters,workDays]);
    const lastMonthAvailable = rostersList.findLast((roster)=>roster.blockChanges === false)

    
    return (
        <>
            <Calendar
                mode='default'
                month={lastMonthAvailable ? getDateFromRoster(lastMonthAvailable) : (new Date())}
                fromYear={rostersList.length > 0 ? rostersList[0].year : new Date().getFullYear()}
                toYear={lastMonthAvailable ? lastMonthAvailable.year : new Date().getFullYear()}
                components={{
                    Day: (props) => 
                    {
                        const isSameMonth = props.date.getMonth() === props.displayMonth.getMonth()
                        const workDay = workDaysList.find((workDay)=> handleisSameDate(workDay.day,props.date))
                        const shiftsInThisWorkDay = workDay?.shiftsId.flatMap(shiftId => shiftsList.filter(shift => shift.id === shiftId)) || [];
                        const shiftInThisDay = shiftsInThisWorkDay.length > 0 ? shiftsInThisWorkDay.map(shift => shift.name).join(" | ") : "-";
                    return  isSameMonth ?
                            <div className="flex flex-col gap-3 text-2xl">
                                {props.date.getDate()}
                                <DialogComponent
                                    day={props.date}
                                    workDay={workDay}
                                    shifts={shiftsInThisWorkDay}
                                    shiftInThisDay={shiftInThisDay}
                                    isSameMonth={isSameMonth}
                                    onWorkDayUpdate={handleUpdateWorkDay}
                                />
                            </div> 
                            :
                            <div className="flex flex-col gap-3 text-2xl">
                                {props.date.getDate()}
                                <div>
                                
                                <DialogComponent
                                    day={props.date}
                                    workDay={workDay}
                                    shifts={shiftsList}
                                    shiftInThisDay={shiftInThisDay}
                                    isSameMonth={isSameMonth}
                                />
                                </div>
                            </div>
                    }
                }}
            />
            <RegisterWorkDayButton workDays={workDaysList}/>    

        </>
    );
}
