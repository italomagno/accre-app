
import {z} from "zod";
import { getShiftById } from "./app/settings/shifts/action";
import { Roster, Shift, WorkDay } from "@prisma/client";
import { getMonthFromRosterInNumber } from "./lib/utils";



export const registerOrUpdateSchema = z.object({
    day: z.date({}),
    workdayId: z.string({}).optional(),
    shiftId1: z.string({
        required_error: 'Adicionar um turno é obrigatório.',
    }).refine(value => value !== '', 'Adicionar um turno é obrigatório.')
    .refine(value => value !== '0', 'Selecione pelo menos um turno.'),
    shiftId2: z.string()
}).refine( value =>{
    const {shiftId1, shiftId2} = value;
    if(shiftId1 !== shiftId2) return true;
  },'Turnos devem ser diferentes.').refine(async value =>{
    const {shiftId1, shiftId2} = value;
    if(shiftId2){
        const shift1 = await getShiftById(shiftId1)
        const shift2 = await getShiftById(shiftId2)
        if("code" in shift1 || "code" in shift2) return false;
        if(shift2.isAbscence === true) return true;
        return checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1, shift2)
    }
    return false;
},'Turnos devem ter pelo menos 8 horas de descanso entre eles.')

export type RegisterOrUpdateValues = z.infer<typeof registerOrUpdateSchema>;


export function checkIfthisShiftIsNightShift(start:Date, end:Date){
    const startHour = start.getHours();
    const endHour = end.getHours();
    if(startHour >= 22 || endHour <= 6)
        return true;
    return false;
}
export function checkIfThisWorkDayHasShiftWorkDay(workDay:WorkDay, shifts:Shift[]){
   return workDay.shiftsId.some((shiftId) =>{
        const shift = shifts.find((shift) => shift.id === shiftId);
        if(!shift) return false;
        if(shift.isAbscence) return false;
        return true;
      });

}
export function getShiftFromWorkDay(workDay:WorkDay, shifts:Shift[]){

    return workDay.shiftsId.map((shiftId) =>{
        return shifts.find((shift) => shift.id === shiftId);
    });
}

export function checkIfThisWorkDayHasNightShift(workDay:WorkDay, shifts:Shift[]){
    return workDay.shiftsId.some((shiftId) =>{
        const shift = shifts.find((shift) => shift.id === shiftId);
        if(!shift) return false;
        const {start, end} = shift;
        const isNightShift = checkIfthisShiftIsNightShift(new Date(start), new Date(end));
        return isNightShift;
      });
   
}

export function checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1:Shift, shift2:Shift){
    const shift1EndTime = new Date(shift1.end).getTime();
    const shift2StartTime = (new Date(shift2.start)).getTime();
    const diff = shift2StartTime - shift1EndTime;
    const diffInHours = new Date(diff).getTime()
    if(diffInHours >= 8 * 60 * 60 * 1000)
        return true;
    return false;
}
export function checkIfhasShiftInterpolation(shift1:Shift, shift2:Shift){
    const shift1StartTime = new Date(shift1.end).getTime();
    const shift1EndTime = new Date(shift1.end).getTime();
    const shift2StartTime = (new Date(shift2.start)).getTime();
    if(shift2StartTime >= shift1StartTime && shift2StartTime <= shift1EndTime)
        return true;
    return false;
}

export function handleGetDateHoursString(date:Date):string{
    return new Date(date).toLocaleTimeString(
        'pt-BR',
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      )
}

type CheckIfHas48HoursOfRestAfter6DaysOfWorkProps ={
    allWorkDays:WorkDay[],date:number,shifts:Shift[],rosterAvailablesToChange:Roster
}

export function checkIfHas48HoursOfRestAfter6DaysOfWork({allWorkDays,date,rosterAvailablesToChange,shifts}:CheckIfHas48HoursOfRestAfter6DaysOfWorkProps){
    const lastDayOfWork = allWorkDays.find(workDay=>workDay.day.getDate()===date)
    const nextDayOfWork = allWorkDays.slice(date-1).find(workDay=>workDay)
    if(!nextDayOfWork) return true

    if(!lastDayOfWork){
        const newLastDayOfWork = allWorkDays.find(workDay=>workDay.day.getDate() === date-1)
        if(!newLastDayOfWork) return true
        const startHourOfNextDayOfWork = shifts.filter(shift=> newLastDayOfWork.shiftsId.includes(shift.id)).filter(shift=>shift.isAbscence === false).find(shift=>shift)
        const endDateHourOflastDayOfWorkThatCompleteSiDaysInSequencing = shifts.filter(shift=> newLastDayOfWork.shiftsId.includes(shift.id)).filter(shift=>shift.isAbscence === false).find(shift=>shift)
        if(!startHourOfNextDayOfWork || !endDateHourOflastDayOfWorkThatCompleteSiDaysInSequencing ) return true
        const lastDayofWorkDate = newLastDayOfWork.day.getDate()
        const nextDayOfWorkDate = nextDayOfWork.day.getDate()
        console.log(nextDayOfWorkDate,lastDayofWorkDate+2)
        if(nextDayOfWorkDate < lastDayofWorkDate+2) return false
        if(nextDayOfWorkDate === lastDayofWorkDate+2){
        if(!startHourOfNextDayOfWork) return true
        if(!endDateHourOflastDayOfWorkThatCompleteSiDaysInSequencing) return true
        const hourStart = handleGetDateHoursString(startHourOfNextDayOfWork.start).split(":")
        const [hStart,mStart] = hourStart
        const hourEnd =  handleGetDateHoursString(endDateHourOflastDayOfWorkThatCompleteSiDaysInSequencing.end).split(":")
        const [hEnd,mEnd] = hourEnd
        return hEnd < hStart
        }
    }else{
        const newLastDayOfWork = lastDayOfWork
        if(!newLastDayOfWork) return true
        const startHourOfNextDayOfWork = shifts.filter(shift=> nextDayOfWork.shiftsId.includes(shift.id)).filter(shift=>shift.isAbscence === false).find(shift=>shift)
        const endDateHourOflastDayOfWorkThatCompleteSiDaysInSequencing = shifts.filter(shift=> newLastDayOfWork.shiftsId.includes(shift.id)).filter(shift=>shift.isAbscence === false).find(shift=>shift)
        if(!startHourOfNextDayOfWork || !endDateHourOflastDayOfWorkThatCompleteSiDaysInSequencing ) return true
        const lastDayofWorkDate = newLastDayOfWork.day.getDate()
        const nextDayOfWorkDate = nextDayOfWork.day.getDate()
        if(nextDayOfWorkDate < lastDayofWorkDate+2) return false
        if(nextDayOfWorkDate === lastDayofWorkDate+2){
        if(!startHourOfNextDayOfWork) return true
        if(!endDateHourOflastDayOfWorkThatCompleteSiDaysInSequencing) return true
        const hourStart = handleGetDateHoursString(startHourOfNextDayOfWork.start).split(":")
        const [hStart,mStart] = hourStart
        const hourEnd =  handleGetDateHoursString(endDateHourOflastDayOfWorkThatCompleteSiDaysInSequencing.end).split(":")
        const [hEnd,mEnd] = hourEnd
        return hEnd < hStart
        }
    }

}
