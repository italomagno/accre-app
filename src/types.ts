import { z } from 'zod';
import { DateStartEndSchema } from './lib/date';
import {
  DepartmentClassification,
  DepartmentTypes,
  Shift
} from '@prisma/client';

export type optionsProps = {
  optionTitle: string;
  optionValues: string[];
};
export type AvailableShifts = {
  title: string;
  shifts: {
    shift: Shift; // Use the actual type of shift here
    day: Date;
    quantity: number;
    count: number;
    sum: number;
    isComplete: boolean;
  }[];
}[];

export type ErrorTypes = {
  code: number;
  message: string;
};
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
const classificationsEnumsToZodSchemaRegisterDepartment = Object.keys(
  DepartmentClassification
).map((key) => key);
export const registerDepartmentSchema = z.object({
  departmentName: z
    .string({ required_error: 'Nome do departamento é obrigatório' })
    .min(3, 'O nome do departamento deve conter no mínimo 3 caracteres.')
    .refine((value) => value !== '', 'Nome do departamento é obrigatório.'),
  email: z
    .string({
      required_error: 'E-mail é obrigatório'
    })
    .email('E-mail inválido.')
    .refine((value) => value !== '', 'E-mail é obrigatório.'),
  password: z
    .string({
      required_error: 'Senha é obrigatória'
    })
    .min(6, 'A senha deve conter no mínimo 6 caracteres.')
    .refine((value) => value !== '', 'Senha é obrigatória.'),
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'O nome deve conter no mínimo 3 caracteres.')
    .refine((value) => value !== '', 'Nome é obrigatório.'),
  type: z.nativeEnum(DepartmentTypes).default('OTHER'),
  classification: z.nativeEnum(DepartmentClassification).default('FOUR')
});
export const registerUserSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'O nome deve conter no mínimo 3 caracteres.')
    .refine((value) => value !== '', 'Nome é obrigatório.'),
  email: z
    .string({
      required_error: 'E-mail é obrigatório'
    })
    .email('E-mail inválido.')
    .refine((value) => value !== '', 'E-mail é obrigatório.'),
  password: z.string({}),
  function: z
    .string({ required_error: 'Função Operacional é obrigatório' })
    .refine((value) => value !== '', 'Função Operacional é obrigatório.'),
  departmentId: z
    .string({ required_error: 'Departamento é obrigatório' })
    .refine((value) => value !== '', 'Departamento é obrigatório.')
});

export function isErrorTypes(arg: any): arg is ErrorTypes {
  return arg.code !== undefined;
}

const roleValues = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve conter no mínimo 3 caracteres.')
    .refine((value) => value !== '', 'Nome é obrigatório.'),
  email: z
    .string()
    .email('E-mail inválido.')
    .refine((value) => value !== '', 'E-mail é obrigatório.'),
  function: z
    .string()
    .refine((value) => value !== '', 'Função Operacional é obrigatório.'),
  block_changes: z.boolean().default(false),
  isOffice: z.boolean().default(false),
  role: z.nativeEnum(roleValues).default('USER')
});
export const updateMyAccountSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve conter no mínimo 3 caracteres.')
    .refine((value) => value !== '', 'Nome é obrigatório.'),
  email: z
    .string()
    .email('E-mail inválido.')
    .refine((value) => value !== '', 'E-mail é obrigatório.'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres.'),
  function: z
    .string()
    .refine((value) => value !== '', 'Função Operacional é obrigatório.'),
  block_changes: z.boolean(),
  isOffice: z.boolean()
});
export const CreateDepartmentAndUserSchema = registerDepartmentSchema.merge(
  registerUserSchema.omit({ departmentId: true, function: true })
);
export type CreateDepartmentAndUserValues = z.infer<
  typeof CreateDepartmentAndUserSchema
>;

export type UpdateMyAccountValues = z.infer<typeof updateMyAccountSchema>;

export type UpdateUserValues = z.infer<typeof updateUserSchema>;

export type RegisterUserValues = z.infer<typeof registerUserSchema>;

export type RegisterDepartmentValues = z.infer<typeof registerDepartmentSchema>;

export const UpdateRosterSchema = z.object({
  month: z
    .string({
      required_error: 'Mês é obrigatório'
    })
    .refine((value) => value !== '', 'Mês é obrigatório.'),
  year: z
    .string({
      required_error: 'Ano é obrigatório'
    })
    .refine((value) => value !== '', 'Ano é obrigatório.'),
  minWorkingHoursPerRoster: z.number({
    required_error: 'Mínimo de horas é obrigatório'
  }),

  maxWorkingHoursPerRoster: z.number({
    required_error: 'Máximo de horas é obrigatório'
  }),
  blockChanges: z.boolean().default(false),
  minQuantityOnWeekend: z
  .number().default(0).optional(),
});

export type UpdateRosterValues = z.infer<typeof UpdateRosterSchema>;

export const LoginLPNASchema = z.object({
  email: z.string({
    required_error: 'E-mail é obrigatório'
  }).refine((value) => value !== '', 'O E-mail é obrigatório'),
  password: z.string({
    required_error: 'Senha é obrigatória'
  }).refine((value) => value !== '', 'A Senha é obrigatória'),
  savePassword: z.boolean()
});

export type LoginLPNAValues = z.infer<typeof LoginLPNASchema>;


export const LoginSchema = z.object({
  email: z
    .string({
      required_error: 'E-mail é obrigatório'
    })
    .email('E-mail inválido.')
    .refine((value) => value !== '', 'E-mail é obrigatório.'),
  password: z
    .string({
      required_error: 'Senha é obrigatória'
    })
    .min(6, 'A senha deve conter no mínimo 6 caracteres.')
    .refine((value) => value !== '', 'Senha é obrigatório.')
});

export type FormValues = z.infer<typeof LoginSchema>;

export const proposalSchema = z.object({
  proposal: z.string()
});
export type ProposalValues = z.infer<typeof proposalSchema>;

export const createRosterSchema = z.object({
  month: z
    .string({
      required_error: 'Mês é obrigatório'
    })
    .refine((value) => value !== '', 'Mês é obrigatório.'),
  year: z
    .string({
      required_error: 'Ano é obrigatório'
    })
    .refine((value) => value !== '', 'Ano é obrigatório.'),
  minHours: z
    .string({
      required_error: 'Mínimo de horas é obrigatório'
    })
    .refine((value) => value !== '', 'Mínimo de horas é obrigatório.'),
  maxHours: z
    .string({
      required_error: 'Máximo de horas é obrigatório'
    })
    .refine((value) => value !== '', 'Máximo de horas é obrigatório.'),
    minQuantityOnWeekend: z
    .number().default(0),
});

export type CreateRosterValues = z.infer<typeof createRosterSchema>;

export const createShiftSchema = z.object({
  name: z
    .string({
      required_error: 'Nome do turno é obrigatório'
    })
    .refine((value) => value !== '', 'Nome do turno é obrigatório.'),
  quantity: z
    .string({
      required_error: 'Quantidade de turnos é obrigatório'
    })
    .default('0')
    .refine(
      (value) => parseInt(value) < 100,
      'Quantidade de turnos deve ser menor que 100'
    )
    .refine(
      (value) => parseInt(value) >= 0,
      'Quantidade de turnos deve ser maior ou igual a 0'
    ),
  quantityInWeekEnd: z
    .string()
    .default('0'),
  minQuantityInWeekEnd: z
    .string()
    .default('0'),
    maxQuantity: z
    .string()
    .default('0'),
  minQuantity: z
    .string({
      required_error: 'Quantidade mínima de turnos é obrigatório'
    })
    .default('0')
    .refine(
      (value) => parseInt(value) < 100,
      'Quantidade mínima de turnos deve ser menor que 100'
    )
    .refine(
      (value) => parseInt(value) >= 0,
      'Quantidade mínima de turnos deve ser maior ou igual a 0'
    ),
  isAvailable: z
    .boolean({
      required_error: 'Disponibilidade é obrigatória'
    })
    .default(false),
  isAbscence: z
    .boolean({
      required_error: 'Preencher se é um afastamento é obrigatório'
    })
    .default(false),
  isOnlyToSup: z
    .boolean({
      required_error: 'Preencher se é apenas para supervisores é obrigatório'
    })
    .default(false),
  dateStartEnd: DateStartEndSchema
});

export type CreateShiftValues = z.infer<typeof createShiftSchema>;
