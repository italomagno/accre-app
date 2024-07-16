'use client'
import { DialogComponent } from './DialogComponent';
import { Calendar } from '../components/ui/calendar';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { handleisSameDate } from '../lib/date';
import { RegisterWorkDayButton } from '../components/register/workDay/RegisterWorkDayButton';
import { useEffect, useState } from 'react';
import { getDateFromRoster } from '../lib/utils';


export function UniqueRosterCalendarComponent({ shifts, roster, workDays,user,admin }: { shifts: Shift[],user:User,admin?:User , roster: Roster, workDays:WorkDay[]}) {

    const [workDaysList, setWorkDaysList] = useState<WorkDay[]>(()=>workDays)
    const [defaultMonth, setDefaultMonth] = useState<Date>(()=>{
        
        return getDateFromRoster(roster)
    
    })
 
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
            setDefaultMonth(getDateFromRoster(roster))
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
                                    rosterId={roster.id}
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
                                    rosterId={roster.id}
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
             rosterId={roster.id}
             isAdmin={admin?.role === "ADMIN"}
             hasRestrictionsToSave={false}
             />    

        </>
    );
}
