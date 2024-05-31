import { z } from "zod";

export type Shifts = {
  shiftId: string;
  shiftName: string,
  quantityOfMilitary: number,
  hasNecessaryQnt?: number,
  minQuantityOfMilitary?:number,
  monthProposal?:number,
  yearProposal?:number
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
  block_changes?:boolean
  is_expediente?:boolean
}
export type DayOfChoosenMonth = {
  day: number,
  isWeekend: boolean;
}

export type Military = {
  milId: number,
  milName: string,
  shiftsMil: ShiftsMil[],
  block_changes?:boolean,
  is_expediente?: boolean
}

export type ShiftsMil = {
  day: string,
  shift?: string
}

export type BreadCumbItem = {
  href: string;
  title: string;
  isCurrentPage: boolean;
  signOut?: () => void;
}


export const schema = z.object({
  CPF: z.string().min(11, 'O CPF deve conter 11 dígitos.').refine(value => value !== '', 'CPF é obrigatório.'),
  saram: z.string().min(7, 'O Saram deve conter 7 dígitos.').refine(value => value !== '', 'Saram é obrigatório.'),
});
export type FormValues = z.infer<typeof schema>;