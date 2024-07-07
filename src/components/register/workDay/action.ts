'use server';

import { getUserByEmail } from '@/src/app/login/_actions';
import { auth } from '@/src/lib/auth';
import prisma from '@/src/lib/db/prisma/prismaClient';
import { ErrorTypes } from '@/src/types';
import { RegisterOrUpdateValues } from '@/src/validations';
import { $Enums, Prisma, WorkDay } from '@prisma/client';
import { da } from 'date-fns/locale';
import { date } from 'zod';

export async function registerOrUpdateWorkDay(
  data: RegisterOrUpdateValues
): Promise<ErrorTypes> {
  const { workdayId, shiftId1, shiftId2, day } = data;
  try {
    const session = await auth();
    if (!session) {
      return {
        code: 401,
        message: 'Usuário não autenticado'
      };
    }
    const shiftId1Exists = await prisma.shift.findUnique({
      where: {
        id: shiftId1
      }
    });
    if (!shiftId1Exists) {
      return {
        code: 404,
        message: 'Selecione um turno válido'
      };
    }
    const user = await getUserByEmail(session.user.email);
    if ('code' in user) {
      return {
        code: user.code,
        message: user.message
      };
    }

    if (workdayId) {
      const shiftIds: string[] = shiftId2 ? [shiftId1, shiftId2] : [shiftId1];

      await prisma.workDay.update({
        where: {
          id: workdayId
        },
        data: {
          shiftsId: {
            set: shiftIds
          }
        }
      });
    } else {
      const usersIds: string[] = [];
      const shiftIds: string[] = shiftId2 ? [shiftId1, shiftId2] : [shiftId1];
      await prisma.workDay.create({
        data: {
          day,
          user: {
            connect: {
              id: user.id
            }
          },
          shifts: {
            connect: shiftIds.map((shiftId) => ({ id: shiftId }))
          },
          department: {
            connect: {
              id: user.departmentId
            }
          }
        }
      });
    }

    return {
      code: 200,
      message: 'Turno salvo com sucesso'
    };
  } catch (e) {
    console.log(e);
    return {
      code: 500,
      message: 'Erro ao salvar turno'
    };
  }
}

export async function registerOrUpdateManyWorkDays(
  workDays: WorkDay[]
): Promise<ErrorTypes> {
  try {
    const session = await auth();
    if (!session) {
      return {
        code: 401,
        message: 'Usuário não autenticado'
      };
    }
    const user = await getUserByEmail(session.user.email);
    if ('code' in user) {
      return {
        code: user.code,
        message: user.message
      };
    }
    const rosters = await prisma.roster.findMany({
      where: {
        departmentId: user.departmentId
      }
    });
    if (!rosters) {
      return {
        code: 404,
        message: 'Não há escala cadastrada'
      };
    }
    const workDaysWithoutId = workDays.filter((workDay) => !workDay.id || workDay.id === '0');
    const workDaysToCreate = workDaysWithoutId.map((workDay) => {
      return {
        day: workDay.day,
        userId: user.id,
        shiftsId: {
            set:workDay.shiftsId.filter((shiftId) => shiftId !== '0') 
        } ,
        departmentId: user.departmentId,
        rosterId: rosters
        .filter((roster) => {
          const monthInEnglishWithThreeLetters = workDay.day
            .toLocaleString('en', { month: 'short' })
            .toUpperCase() as keyof typeof $Enums.Months;
          const month = $Enums.Months[monthInEnglishWithThreeLetters];
          roster.month === month && roster.year === workDay.day.getFullYear();
        }).map((roster) => roster.id)
      };
    });
    if(workDaysToCreate.length > 0){
        const createdShifts = await prisma.workDay.createMany({
            data: workDaysToCreate
          });
    }
    const workDaysWithId = workDays.filter((workDay) => workDay.id && workDay.id !== '0');
    if(workDaysWithId.length > 0){
    workDaysWithId.map(async (workDay) => {
      await prisma.workDay.update({
        where:{id:workDay.id},
          data:{
            rosterId:{
                set: rosters.filter((roster)=>{
                    const monthInEnglishWithThreeLetters = workDay.day
                    .toLocaleString('en', { month: 'short' })
                    .toUpperCase() as keyof typeof $Enums.Months;
                  const month = $Enums.Months[monthInEnglishWithThreeLetters];
                  return roster.month === month && roster.year === workDay.day.getFullYear();
                }).map((roster) => roster.id)
            },
          shiftsId: {
            set:workDay.shiftsId.filter((shiftId) => shiftId !== '0')}
        },
        })
      })
    }
    
  

    return {
      code: 200,
      message: `turnos salvos com sucesso`
    };
  } catch (e) {
    console.log(e);
    return {
      code: 500,
      message: 'Erro ao salvar turnos'
    };
  }
}
