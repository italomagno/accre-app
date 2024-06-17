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
export type ErrorTypes = {
    code: number;
    message: string;
}



export const registerDepartmentSchema = z.object({
    departmentName: z.string().min(3, 'O nome do departamento deve conter no mínimo 3 caracteres.').refine(value => value !== '', 'Nome do departamento é obrigatório.'),
    spreadSheetId: z.string().min(44, 'O id da planilha deve conter 44 caracteres.'),
    CPF: z.string().min(11, 'O CPF deve conter 11 dígitos.').refine(value => value !== '', 'CPF é obrigatório.'),
    saram: z.string().min(7, 'O Saram deve conter 7 dígitos.').refine(value => value !== '', 'Saram é obrigatório.'),
    email: z.string().email('E-mail inválido.').refine(value => value !== '', 'E-mail é obrigatório.'),
    name: z.string().min(3, 'O nome deve conter no mínimo 3 caracteres.').refine(value => value !== '', 'Nome é obrigatório.'),
})

export type RegisterDepartmentValues = z.infer<typeof registerDepartmentSchema>;


export const LoginSchema = z.object({
    CPF: z.string().min(11, 'O CPF deve conter 11 dígitos.').refine(value => value !== '', 'CPF é obrigatório.'),
    saram: z.string().min(7, 'O Saram deve conter 7 dígitos.').refine(value => value !== '', 'Saram é obrigatório.'),
  });
  
  export type FormValues = z.infer<typeof LoginSchema>;

  export const proposalSchema = z.object({
    proposal: z.string()
  });
  
  export type ProposalValues = z.infer<typeof proposalSchema>;