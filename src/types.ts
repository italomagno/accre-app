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
export type registerDepartmentType = {
    departmentName: string,
    spreadSheetId: string,
  }

    const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
  
export const createManyUsersSchema = z.object({
    
    file: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        return !file || file.size <= MAX_UPLOAD_SIZE;
      }, 'File size must be less than 5MB')
        .refine((file) => {
        return !file || file.name.endsWith('.csv');
        }, 'File must be a CSV')
});

export type RegisterManyUsersValues = z.infer<typeof createManyUsersSchema>;

export const registerDepartmentSchema = z.object({
    departmentName: z.string().min(3, 'O nome do departamento deve conter no mínimo 3 caracteres.').refine(value => value !== '', 'Nome do departamento é obrigatório.'),
    spreadSheetId: z.string(),
    email: z.string().email('E-mail inválido.').refine(value => value !== '', 'E-mail é obrigatório.'),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres.').refine(value => value !== '', 'Senha é obrigatório.'),
    name: z.string().min(3, 'O nome deve conter no mínimo 3 caracteres.').refine(value => value !== '', 'Nome é obrigatório.'),
})

export const registerUserSchema = z.object({
    name: z.string().min(3, 'O nome deve conter no mínimo 3 caracteres.').refine(value => value !== '', 'Nome é obrigatório.'),
    email: z.string().email('E-mail inválido.').refine(value => value !== '', 'E-mail é obrigatório.'),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres.').refine(value => value !== '', 'Senha é obrigatório.'),
    function: z.string().refine(value => value !== '', 'Função Operacional é obrigatório.'),
    departmentId: z.string().refine(value => value !== '', 'Departamento é obrigatório.'),
})

export type RegisterUserValues = z.infer<typeof registerUserSchema>;

export type RegisterDepartmentValues = z.infer<typeof registerDepartmentSchema>;


export const LoginSchema = z.object({
    email: z.string().email('E-mail inválido.').refine(value => value !== '', 'E-mail é obrigatório.'),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres.').refine(value => value !== '', 'Senha é obrigatório.'),
  });
  
  export type FormValues = z.infer<typeof LoginSchema>;

  export const proposalSchema = z.object({
    proposal: z.string()
  });
  
  export type ProposalValues = z.infer<typeof proposalSchema>;

