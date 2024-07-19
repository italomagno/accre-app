'use client'
import { DialogComponent } from './DialogComponent';
import { Calendar } from '../components/ui/calendar';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { handleisSameDate } from '../lib/date';
import { RegisterWorkDayButton } from '../components/register/workDay/RegisterWorkDayButton';
import { useEffect, useState } from 'react';
import { getDateFromRoster } from '../lib/utils';


export function CalendarComponent({ shifts, rosters, workDays,user,admin }: { shifts: Shift[],user:User,admin?:User , rosters: Roster[], workDays:WorkDay[]}) {

    const [workDaysList, setWorkDaysList] = useState<WorkDay[]>(()=>workDays)
    const [defaultMonth, setDefaultMonth] = useState<Date>(()=>{
        const findFistAvailable = rosters.find(roster => roster.blockChanges === false)
        if(findFistAvailable){
            return getDateFromRoster(findFistAvailable)
        }
        return new Date()
    
    })
    const [rostersDates, setRostersDates] = useState<{id:string,isAvailable:boolean,
        date:Date}[]>(() => rosters.map(roster => ({
            
            id:roster.id,
            
            isAvailable: !roster.blockChanges,
            date:getDateFromRoster(roster)})).sort((a,b)=>a.date.getTime() - b.date.getTime()).sort((a,b)=> (a.isAvailable ? 1 : 0) - (b.isAvailable ? 1 : 0) ))
    const [rosterId, setRosterId] = useState<string>()
   
            function handleUpdateWorkDay(workDay: WorkDay,rosterId:string){
        const alreadyExists = workDaysList.find((workDayInList)=>workDayInList.day.getDate() === workDay.day.getDate() && workDayInList.day.getMonth() === workDay.day.getMonth() && workDayInList.day.getFullYear() === workDay.day.getFullYear())
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
            const newWorkDay:WorkDay = {
                ...workDay,
                userId: user.id,
                rosterId: rosterId

            }
            setWorkDaysList([...workDaysList,newWorkDay])
        }
    }
    useEffect(()=>{
        setRosterId(rostersDates[0].id)
        const findFistAvailable = rosters.find(roster => roster.blockChanges === false)
        if(admin && findFistAvailable === undefined){

            setDefaultMonth(getDateFromRoster(rosters[0]))
        }
        if(findFistAvailable){
            setDefaultMonth(getDateFromRoster(findFistAvailable))
        }
        setDefaultMonth(rostersDates[0].date)
    },[])
        
    
    
    return (
        <>
            <Calendar
                mode='default'
                defaultMonth={defaultMonth}
                components={{
                    Day: (props) => 
                    {
                        const isSameMonth = props.date.getMonth() === props.displayMonth.getMonth()
                         if(defaultMonth?.getMonth()!== props.date.getMonth()){
                            const isAvailableShift = rostersDates.find(roster => roster.isAvailable && roster.date.getMonth() === props.date.getMonth() && roster.date.getFullYear() === props.date.getFullYear())
                            if(!isAvailableShift) setRosterId(undefined)
                                setRosterId(isAvailableShift?.id)
                               
                        }
                        const workDay =  workDaysList.find((workDay)=>workDay.day.getDate() === props.date.getDate() && workDay.day.getMonth() === props.date.getMonth() && workDay.day.getFullYear() === props.date.getFullYear())
                        const shiftsInThisWorkDay = workDay ? workDay.shiftsId.map(id => {
                            const shift = shifts.find(shift => shift.id === id);
                            return shift || null;
                        }).filter((shift): shift is Shift => shift !== null) : [];
                        const shiftInThisDay = shiftsInThisWorkDay.length > 0 ? shiftsInThisWorkDay.map(shift => shift.name).join(" | ") : "-";

                    return  isSameMonth ?
                            <div className="flex flex-col gap-3 text-2xl">
                                {props.date.getDate()}
                                <DialogComponent
                                    day={props.date}
                                    rosterId={rosterId}
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
                                    rosterId={rosterId}
                                    workDay={workDay}
                                    shifts={shifts}
                                    shiftInThisDay={shiftInThisDay}
                                    isSameMonth={isSameMonth}
                                />
                                </div>
                            </div>
                    }
                }}
            />
            <RegisterWorkDayButton
             workDays={workDaysList}
             rosterId={rosterId ?? ""}
             hasRestrictionsToSave={true}
             />    

        </>
    );
}
