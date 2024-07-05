
import {z} from "zod";
import { getShiftById } from "./app/settings/shifts/action";
import { Shift } from "@prisma/client";



export const registerOrUpdateSchema = z.object({
    day: z.date({}),
    workdayId: z.string({}),
    shiftId1: z.string({
        required_error: 'Adicionar um turno é obrigatório.',
    }).refine(value => value !== '', 'Adicionar um turno é obrigatório.')
    .refine(value => value !== '0', 'Selecione pelo menos um turno.'),
    shiftId2: z.string(),
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

// Remove the unused type declaration

export function checkIfHasSixOrMoreDaysConsecultivesOfWork(date:Date){
    const sixDays = 6 * 24 * 60 * 60 * 1000;
    const dateToCheck = new Date(date).getTime();
    const today = new Date().getTime();
    if(today - dateToCheck >= sixDays) return true;
    return false;
}

export function checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1:Shift, shift2:Shift){
    const shift1EndTime = new Date(shift1.end).getTime();
    const shift2StartTime = new Date(shift2.start).getTime();
    const eightHours = 8 * 60 * 60 * 1000;
    if(shift2StartTime - shift1EndTime >= eightHours) return true;
    return false;
}
