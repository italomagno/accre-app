import { type ClassValue, clsx } from "clsx"

import { twMerge } from "tailwind-merge"
import { Roster, Shift, User, WorkDay } from "@prisma/client";
import shiftPage from "../app/settings/shifts/page";

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
export function removeHyphens(objectId:string) {
  return objectId.replace(/-/g, '');
}
export function addHyphens(cleanedObjectId:string) {
  return cleanedObjectId.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      '$1-$2-$3-$4-$5'
  );
}
export function removeHyphensAndCompress(objectId:string) {
  const hexString = objectId.replace(/-/g, '');
  const buffer = Buffer.from(hexString, 'hex');
  const compressed = buffer.toString('base64').slice(0, 16); // Take only the first 16 characters
  return compressed;
}

export function decompressAndAddHyphens(compressedObjectId:string) {
  const buffer = Buffer.from(compressedObjectId, 'base64');
  const hexString = buffer.toString('hex');
  return hexString.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      '$1-$2-$3-$4-$5'
  );
}

export  const transformToVector =  (header:string[], data:any[]) => {

  const csvContent = [
      header, 
      ...data
    ]
  
    return csvContent

};


export function getAvailableShiftsDayUsingVectors(
 {
  shifts,
  workDays,
  roster,
  users
 }:{ shifts: Shift[],
  workDays: WorkDay[],
  users: User[],
  roster: Roster}
) {
  const WorkDaysColumn = createWorkDaysColumn(roster);
  const counterUsersPerday = users.map((user) => {
    const shiftPerDay = WorkDaysColumn.map((day) => {
      const newDate = day.day;
      const isWeekend = day.isWeekend;
      const workDay = workDays.find(
        (workDay) =>
          workDay.userId === user.id && workDay.day.getDate() === newDate
      );
      const shiftsInThisWorkDay =
        workDay?.shiftsId.flatMap((shiftId) =>
          shifts.filter((shift) => shift.id === shiftId)
        ) || [];
      const shiftInThisDay =
        shiftsInThisWorkDay.length > 0
          ? shiftsInThisWorkDay.map((shift) => shift.name).join(' | ')
          : '-';
      if (!workDay) return '-';
      return {shiftInThisDay,
        isWeekend
      };
    });
    return {
      user,
      days: [...shiftPerDay]
    };
  });

  const counterUserPerDayHeading = [
    'Usuário',
    ...WorkDaysColumn
  ];

    const resultFromDownloadCSV = transformToVector(counterUserPerDayHeading.map(day=>{
      if(typeof day === 'string'){
        return day
      }
      return String(day.day)
    }), counterUsersPerday.map(row=>{

      return [row.user.name, ...row.days.map(day=>{
        if(typeof day === 'string'){
          return day
        }
        return day.shiftInThisDay
      })]
    }));

  const counterShiftsPerday = shifts.map((shift) => {
    return [...WorkDaysColumn.map((workdayObject) => {
      const { day, isWeekend } = workdayObject;
      const columnOfShifts:string[] = resultFromDownloadCSV.map(row=>{
        const cellData = row[day];
        const hasVerticalBar = cellData.includes('|');
        if(hasVerticalBar){
          const shifts = cellData.split(' | ');
          return shifts
        }
        return [cellData]
      })
      const quantityOfThisShift = columnOfShifts
          .filter(
            (workDay) =>
              workDay.includes(shift.name) || workDay.includes(shift.id)
          ).length
          const isComplete = quantityOfThisShift >= shift.quantity;
        const count = Math.abs(shift.quantity - quantityOfThisShift)
          return {
            shift,
            day:day,
            month:getMonthFromRosterInNumber(roster),
            year:roster.year,
            quantity: shift.quantity,
            count,
            sum: quantityOfThisShift,
            isComplete
          };
     
    })];
  }).flat();



return counterShiftsPerday
 
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


export const counterShiftsPerDay = (shifts:Shift[],WorkDaysColumn:{
  day: number;
  isWeekend: boolean;
}[]  ,resultFromDownloadCSV:any[]
)=>{
  return shifts.map((shift) => {

    
    const shiftPerDay = WorkDaysColumn.map((workdayObject) => {
      const { day, isWeekend } = workdayObject;

      const columnOfShifts:string[] = resultFromDownloadCSV.map(row=>{
        const cellData = row[day];
        const hasVerticalBar = cellData.includes('|');
        if(hasVerticalBar){
          const shifts = cellData.split(' | ');
          return shifts
        }
        return [cellData]
      })

      return {
        day,
        cellData: columnOfShifts
          .filter(
            (workDay) =>
              workDay.includes(shift.name) || workDay.includes(shift.id)
          ).length,
        isWeekend
      };
    });
    
    return {
      shift,
      days: [...shiftPerDay]
    };
  });

}










