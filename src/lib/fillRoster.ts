"use server"
import { Shift } from "@prisma/client";
import { addDays, differenceInHours, isAfter, isBefore, parse } from 'date-fns';
import { auth } from "./auth";
import { ErrorTypes } from "../types";
import { getUserByEmail } from "../app/login/_actions";
import prisma from "./db/prisma/prismaClient";
import { counterShiftsPerDay } from "./utils";

// Helper function to parse a time string (e.g., "20:00") into a Date object on the current day
const parseTime = (time: string): Date => {
  return parse(time, 'HH:mm', new Date());
};

// Function to calculate if there are two days of rest after a given date
const hasTwoDaysRest = (date: Date, roster: string[][]): boolean => {
  const dayIndex = date.getDate();
  if (dayIndex + 2 > roster[0].length - 1) {
    return false;
  }
  return roster.every((userRoster) => userRoster[dayIndex + 1] === '-' && userRoster[dayIndex + 2] === '-');
};

// Function to check if a shift can be assigned to a user on a given day
const canAssignShift = (
  userRoster: string[],
  dayIndex: number,
  shift: Shift,
  shifts: Shift[],
  roster: string[][]
): boolean => {
  if (userRoster[dayIndex] !== '-') {
    return false;
  }

  let consecutiveShifts = 0;
  for (let i = dayIndex; i >= 0 && i >= dayIndex - 5; i--) {
    if (userRoster[i] !== '-') {
      consecutiveShifts++;
    } else {
      break;
    }
  }
  if (consecutiveShifts >= 6 && !hasTwoDaysRest(addDays(new Date(), dayIndex + 1), roster)) {
    return false;
  }

  if (dayIndex > 0) {
    const previousDayShift = userRoster[dayIndex - 1];
    if (previousDayShift !== '-') {
      const [shiftName] = previousDayShift.split('|');
      const previousShift = shifts.find((s) => s.name === shiftName);
      if (previousShift) {
        const previousShiftEnd = parseTime(previousShift.end.toISOString().slice(11, 16));
        if (isAfter(previousShiftEnd, parseTime('20:45')) && isBefore(previousShiftEnd, parseTime('06:00'))) {
          return false;
        }
      }
    }
  }

  return true;
};

// Function to fill the roster table with shifts
export const fillRoster = async (roster: string[][],workDaysColumn: {
  day: number;
  isWeekend: boolean;
}[])/* : Promise<string[][] | ErrorTypes> */ => {
  try {
    const session = await auth();
    if (!session) return { code: 401, message: "Usuário não autenticado" };

    const user = await getUserByEmail(session.user.email);
    if ("code" in user) return { code: user.code, message: user.message };

    const shifts = await prisma.shift.findMany({
      where: { departmentId: user.departmentId,
        quantity: { gt: 0 },
        isAbscence: false
       }
    });
    const supervisors = await prisma.user.findMany({
      where: { departmentId: user.departmentId,
        function: "SUP" }
       });
       const operators = await prisma.user.findMany({
        where: { departmentId: user.departmentId,
          function: "OPE" }
         });

    const [mil,...days] = roster.shift() as [string, string[]];

    const completeShiftsAndTheDayFromOperators:any[] = []
    const inCompleteShiftsAndTheDayFromOperators:any[] = []
    const completeShiftsAndTheDayFromSupervisors:any[] = []
    const inCompleteShiftsAndTheDayFromSupervisors:any[] = []

    counterShiftsPerDay(shifts,workDaysColumn,roster).forEach((counter)=>{
      const {shift,days} = counter
      if(shift.isOnlyToSup === false){
      const ShiftsWithExcess = days.filter(day=>day.cellData > shift.quantity).map(day=>({...day,shiftName:shift.name,id:shift.id,excess:day.cellData - shift.quantity}))
      const qntOfShiftsWithExcess = days.filter(day=>day.cellData > shift.quantity).length
      const ShiftsWithoutFilling = days.filter(day=>day.cellData < shift.quantity).map(day=>({...day,shiftName:shift.name,id:shift.id,excess:shift.quantity - day.cellData}))
      const qntOfShiftsWithoutFilling = days.filter(day=>day.cellData < shift.quantity).length
      if(qntOfShiftsWithExcess > 0){
        completeShiftsAndTheDayFromOperators.push(...ShiftsWithExcess)
      }
      if(qntOfShiftsWithoutFilling > 0){
        inCompleteShiftsAndTheDayFromOperators.push(...ShiftsWithoutFilling)
      }
    }else{
      const ShiftsWithExcess = days.filter(day=>day.cellData > shift.quantity).map(day=>({...day,shiftName:shift.name,id:shift.id,excess:day.cellData - shift.quantity}))
      const qntOfShiftsWithExcess = days.filter(day=>day.cellData > shift.quantity).length
      const ShiftsWithoutFilling = days.filter(day=>day.cellData < shift.quantity).map(day=>({...day,shiftName:shift.name,id:shift.id,excess:shift.quantity - day.cellData}))
      const qntOfShiftsWithoutFilling = days.filter(day=>day.cellData < shift.quantity).length
      if(qntOfShiftsWithExcess > 0){
        completeShiftsAndTheDayFromSupervisors.push(...ShiftsWithExcess)
      }
      if(qntOfShiftsWithoutFilling > 0){
        inCompleteShiftsAndTheDayFromSupervisors.push(...ShiftsWithoutFilling)
      }
    }
    }
    )

    const hasSuficientShiftsToFillDataOperators = completeShiftsAndTheDayFromOperators.length >= inCompleteShiftsAndTheDayFromOperators.length
    const howManyMoreShiftsOperators = completeShiftsAndTheDayFromOperators.length - inCompleteShiftsAndTheDayFromOperators.length
  
    const hasSuficientShiftsToFillDataSupervisors = completeShiftsAndTheDayFromSupervisors.length >= inCompleteShiftsAndTheDayFromSupervisors.length
    const howManyMoreShiftsSupervisors = completeShiftsAndTheDayFromSupervisors.length - inCompleteShiftsAndTheDayFromSupervisors.length
    console.log(hasSuficientShiftsToFillDataOperators, howManyMoreShiftsOperators,hasSuficientShiftsToFillDataSupervisors,howManyMoreShiftsSupervisors);




   



    

    //count if has suficient shifts to fill data
    //get the roster in a table format
    //check if the shifts is filled for this day
    //save this shift and day
    //check if the has shifts without filling



  /*   console.log(JSON.stringify(updatedRoster, null, 2));
    return updatedRoster; */

  } catch (error) {
    console.log(error);
    return { code: 500, message: "Erro ao tentar preencher a escala" };
  }
};
