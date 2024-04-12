
export type Shifts = {
  shiftId: string;
  shiftName: string,
  quantityOfMilitary: number,
  hasNecessaryQnt?: number
}

 export type Tab = {
  name:string,
  month:number,
  year:number,
  militaries:Military[],
  controlers:Shifts[][]
}

export type DataFromSheet={
  dataFromSheets:MilitaryFromSheet[],
  tabs:Tab[]
}


export type MilitaryFromSheet = {
  cpf: string
  saram: string,
  name: string,
  email: string,
}
export type DayOfChoosenMonth = {
  day: number,
  isWeekend: boolean;
}

export type Military = {
  milId: number,
  milName: string,
  shiftsMil: ShiftsMil[],
  block_changes?:string
}

export type ShiftsMil = {
  day: string,
  shift?: string
}

export type BreadCumbItem = {
  href: string;
  title: string;
  isCurrentPage: boolean;
}
