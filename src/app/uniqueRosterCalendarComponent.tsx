'use client'
import { DialogComponent } from './DialogComponent';
import { Calendar } from '../components/ui/calendar';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { handleisSameDate } from '../lib/date';
import { RegisterWorkDayButton } from '../components/register/workDay/RegisterWorkDayButton';
import { useEffect, useState } from 'react';
import { getDateFromRoster } from '../lib/utils';
import { ShiftsTable } from '../components/tables/shiftsTable';
import { getWorkDays } from './lancamento/action';


export function UniqueRosterCalendarComponent({ shifts, roster, workDays,user,admin }: { shifts: Shift[],user:User,admin?:User , roster: Roster, workDays:WorkDay[]}) {

    const [workDaysList, setWorkDaysList] = useState<WorkDay[]>(()=>workDays)
    const [previewWorkDays, setPreviewWorkDays] = useState<WorkDay[]>([])
    const [defaultMonth, setDefaultMonth] = useState<Date>(()=>{
        return getDateFromRoster(roster)
    
    })
    function handleUpdateWorkDay(workDay: WorkDay, rosterId: string) {
        
        const alreadyExists = workDaysList.find((workDayInList) =>
            handleisSameDate(workDayInList.day, workDay.day) && workDayInList.userId === user.id && workDayInList.rosterId === rosterId && workDay.id === workDayInList.id
        );
        
        const alreadyExistsInPreview = previewWorkDays.find((workDayInList) =>
            handleisSameDate(workDayInList.day, workDay.day) && workDayInList.userId === user.id
        );
    
        if (alreadyExists) {
            const updatedWorkDays = workDaysList.map((workDayInList) =>
                handleisSameDate(workDayInList.day, workDay.day) && workDayInList.userId === user.id && workDayInList.rosterId === rosterId && workDay.id === workDayInList.id
                    ? workDay
                    : workDayInList
            );
            setWorkDaysList(updatedWorkDays);
        } else {
            const newWorkDay: WorkDay = {
                ...workDay,
                userId: user.id,
                rosterId: rosterId
            };
            setWorkDaysList([...workDaysList, newWorkDay]);
        }
    
        if (alreadyExistsInPreview) {
            const updatedWorkDays = previewWorkDays.map((workDayInList) =>
                handleisSameDate(workDayInList.day, workDay.day) && workDayInList.userId === user.id
                    ? { ...workDayInList, shiftsId: workDay.shiftsId }
                    : workDayInList
            );
            setPreviewWorkDays(updatedWorkDays);
        }
        
    }
    
   async function fetchWorkDays(){
        const response = await getWorkDays()
        if("code" in response){
            return
        }
        setPreviewWorkDays(response)
    }
    useEffect(()=>{
            setDefaultMonth(getDateFromRoster(roster))
            fetchWorkDays()
    },[])
    
    return (
        <div className='flex flex-col gap-2 items-center justify-center'>
            <ShiftsTable shifts={shifts} users={[user]} roster={roster} workDays={previewWorkDays}
            />
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

        </div>
    );
}
