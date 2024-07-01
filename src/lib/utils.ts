import { type ClassValue, clsx } from "clsx"

import { twMerge } from "tailwind-merge"
import {  availableShifts, completeShifts } from "@/src/types";
import { ControllerRenderProps } from "react-hook-form";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function generateUniqueKey(): string {
  return Math.random().toString(36).substring(2, 15);
}

export  const extractSpreadSheetId = (spreadSheetUrl: string) => {
  const regex = /(?<=\/d\/)(.*?)(?=\/)/;
  const result = spreadSheetUrl.match(regex);
  return result ? result[0] : "";
};

export function handleSearchParamsForLaunches(searchParams: string) {
  return `${new URLSearchParams({turnos:searchParams})}`
}

export const getShiftsStatus = (row: any[], shifts: any[]) => {
  const availableShifts: { id: any; shiftName: any; missingQuantity: number; day: any; }[] = [];
  const completeShifts: { id: any; shiftName: any; quantity: any; day: any; }[] = [];
  row.forEach((necessaryShiftsPerDay: { shiftName: any; quantityOfMilitary: number; shiftId: any; day: any; }, j: any) => {
    const shiftFromTableOfShifts = shifts.find(
      (shiftFromTableOfShifts: { shiftName: any; }) => shiftFromTableOfShifts.shiftName === necessaryShiftsPerDay.shiftName
    );

    if (!shiftFromTableOfShifts) return;
    const isAvailable = shiftFromTableOfShifts.quantityOfMilitary < necessaryShiftsPerDay.quantityOfMilitary;
    const isComplete = shiftFromTableOfShifts.quantityOfMilitary >= necessaryShiftsPerDay.quantityOfMilitary;

    if (isAvailable) {
      availableShifts.push({
        id: generateUniqueKey() + necessaryShiftsPerDay.shiftId,
        shiftName: necessaryShiftsPerDay.shiftName,
        missingQuantity: necessaryShiftsPerDay.quantityOfMilitary - shiftFromTableOfShifts.quantityOfMilitary,
        day: necessaryShiftsPerDay.day,
      });
    }

    if (isComplete) {
      completeShifts.push({
        id: generateUniqueKey() + necessaryShiftsPerDay.shiftId,
        shiftName: necessaryShiftsPerDay.shiftName,
        quantity: shiftFromTableOfShifts.quantityOfMilitary,
        day: necessaryShiftsPerDay.day,
      });
    }
  });

  return { availableShifts, completeShifts };
};
export function filterShiftsByDay(shiftsStatus:{availableShifts:availableShifts[],completeShifts:completeShifts[]}, day:number) {
  const { availableShifts, completeShifts } = shiftsStatus;
  const filteredAvailableShifts = availableShifts.filter((shift: { day: number; }) => shift.day === day);
  const filteredCompleteShifts = completeShifts.filter((shift: { day: number; }) => shift.day === day);
  return { availableShifts: filteredAvailableShifts, completeShifts: filteredCompleteShifts };
}



export function applyCpfMask(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

 export function applySaramMask(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{6})(\d)/, '$1-$2')
    .replace(/(-\d)\d+?$/, '$1');
}







