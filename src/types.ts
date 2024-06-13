import { z } from "zod";

export type  optionsProps ={
    optionTitle: string;
    optionValues: string[];
}

export type availableShifts= {
    id: any;
    shiftName: any;
    missingQuantity: number;
    day: any;
};
export type completeShifts = {
    id: any;
    shiftName: any;
    quantity: any;
    day: any;
};
export type ShiftsStatusProps = {
    availableShifts:availableShifts[],
    completeShifts: completeShifts[]
}
export interface Error {
    error: string;
    code: number;
}

export const LoginSchema = z.object({
    CPF: z.string().min(11, 'O CPF deve conter 11 dígitos.').refine(value => value !== '', 'CPF é obrigatório.'),
    saram: z.string().min(7, 'O Saram deve conter 7 dígitos.').refine(value => value !== '', 'Saram é obrigatório.'),
  });
  
  export type FormValues = z.infer<typeof LoginSchema>;