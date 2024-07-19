import { type ClassValue, clsx } from "clsx"

import { twMerge } from "tailwind-merge"
import { Roster, Shift } from "@prisma/client";

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

export function createWorkDaysColumn(roster:Pick<Roster,"month" | "year" | "id">) {
  const {month, year} = roster;
  const monthStringInEnglishToNumberToCollectDaysInMonth = new Date(`${month} 1, ${year}`).getMonth();
  const daysInMonth = new Date(year, monthStringInEnglishToNumberToCollectDaysInMonth+1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
    const isWeekend = new Date(`${month} ${day}, ${year}`).getDay();

    return {day,
      isWeekend: isWeekend === 0 || isWeekend === 6
    }
  
  });
}
export function getMonthFromRoster(roster:Pick<Roster,"month" | "year" | "id">) {
  const {month, year} = roster;
  const getMonthInPortuguese = new Date(`${month} 1, ${year}`).toLocaleString('pt-br', { month: 'long' });
  return getMonthInPortuguese
}
export function getMonthFromRosterInNumber(roster:Pick<Roster,"month" | "year" | "id">) {
  const {month, year} = roster;
  const monthStringInEnglishToNumberToCollectDaysInMonth = new Date(`${month} 1, ${year}`).getMonth();
  return monthStringInEnglishToNumberToCollectDaysInMonth
}
export function getDateFromRoster(roster:Pick<Roster,"month" | "year" | "id">) {
  const {month, year} = roster;
  return new Date(`${month} ${2}, ${year}`);
}
export function handleCellColor(shift:(Pick<Shift,"id" | "name" | "quantity"> & Partial<{[key:string]:unknown}>),day:{
  cellData: number,
  isWeekend: boolean
}):'lessThanNecessary' | 'moreThanNecessary' | 'hasNecessary'| "lessThanNecessaryWeekEnd" | "moreThanNecessaryWeekEnd" | "hasNecessaryWeekEnd"{
  const {cellData,isWeekend} = day;
  if(shift.quantity > cellData){
    return isWeekend ?"lessThanNecessaryWeekEnd":"lessThanNecessary"
  }
  if(shift.quantity < cellData){
    return isWeekend? "moreThanNecessaryWeekEnd":"moreThanNecessary"
  }
  if(shift.quantity === cellData){
    return isWeekend? "hasNecessaryWeekEnd":"hasNecessary"
  }

  return "lessThanNecessary"

}







