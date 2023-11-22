export type Shifts = {
  shiftId: string;
  shiftName: string,
  quantityOfMilitary: number,
  hasNecessaryQnt?: number
}

export type DayOfChoosenMonth = {
  day:number,
  isWeekend:boolean;
}

export type Military = {
  milId: number,
  milName: string,
  shiftsMil: ShiftsMil[]
}

export type ShiftsMil = {
  day: string,
  shift?: string
}

export type BreadCumbItem = {
  href: string;
  title:string;
  isCurrentPage: boolean;
}
