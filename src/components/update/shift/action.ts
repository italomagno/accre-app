'use server';
import { getUserByEmail } from '@/src/app/login/_actions';
import { auth } from '@/src/lib/auth';
import { handleDateStartEnd } from '@/src/lib/date';
import prisma from '@/src/lib/db/prisma/prismaClient';
import { CreateShiftValues, createShiftSchema } from '@/src/types';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createShift(shiftValues: CreateShiftValues) {
  try {
    await createShiftSchema.parseAsync(shiftValues);
    const session = await auth();
    if (!session) {
      return {
        code: 401,
        message: 'Usuário não autenticado'
      };
    }
    const admin = await getUserByEmail(session.user.email);
    if ('code' in admin) {
      return {
        code: 403,
        message: admin.message
      };
    }

    const { dateStartEnd, ...shiftsWithoutDateStartEnd } = shiftValues;
    const { start, end } = handleDateStartEnd(dateStartEnd);

    const newShift: Prisma.ShiftCreateInput = {
      ...shiftsWithoutDateStartEnd,
      minQuantity: parseInt(shiftValues.minQuantity ?? '0'),
      quantity: parseInt(shiftValues.quantity ?? '1'),
      department: {
        connect: {
          id: admin.departmentId
        }
      },
      start,
      end
    };
    const shift = await prisma.shift.create({
      data: newShift
    });
    prisma.$disconnect();
    return shift;
  } catch (err) {
    console.log(err);
    return {
      code: 500,
      message: 'Erro ao criar turno'
    };
  }
}

export async function updateShift(id: string, shiftValues: CreateShiftValues) {
  try {
   const error = await createShiftSchema.parseAsync(shiftValues);
    const session = await auth();
    if (!session) {
      return {
        code: 401,
        message: 'Usuário não autenticado'
      };
    }
    const admin = await getUserByEmail(session.user.email);
    if ('code' in admin) {
      return {
        code: 403,
        message: admin.message
      };
    }

    const { dateStartEnd, ...shiftsWithoutDateStartEnd } = shiftValues;
    const { start, end } = handleDateStartEnd(dateStartEnd);
    const shiftUpdated: Prisma.ShiftUpdateInput = {
      ...shiftsWithoutDateStartEnd,
      minQuantity: parseInt(shiftValues.minQuantity ?? '0'),
      quantity: parseInt(shiftValues.quantity ?? '1'),
      department: {
        connect: {
          id: admin.departmentId
        }
      },
      start,
      end
    };
    const hasShiftWithSameName = await prisma.shift.findFirst({
      where: {
        name: {
          contains: shiftValues.name,
          mode: 'insensitive'
        }
      }
    });

    const shift = await prisma.shift.update({
      where: {
        id,
        departmentId: admin.departmentId
      },
      data: {
        ...shiftUpdated
      }
    });

    if (hasShiftWithSameName) {
      return {
        code: 400,
        message:
          'Já existe um turno com esse nome, por isso não foi possível atualizar o nome do turno'
      };
    }
    prisma.$disconnect();
    revalidatePath('/',"layout");
    return {
      code: 200,
      message: 'Turno atualizado com sucesso'
    };
  } catch (err) {
    return {
      code: 500,
      message: 'Erro ao atualizar turno'
    };
  }
}
