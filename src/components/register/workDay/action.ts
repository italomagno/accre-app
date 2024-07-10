'use server';

import { getUserByEmail } from '@/src/app/login/_actions';
import { auth } from '@/src/lib/auth';
import { handleisSameDate } from '@/src/lib/date';
import prisma from '@/src/lib/db/prisma/prismaClient';
import { createWorkDaysColumn, getMonthFromRoster, getMonthFromRosterInNumber } from '@/src/lib/utils';
import { ErrorTypes } from '@/src/types';
import { RegisterOrUpdateValues, checkIfHas48HoursOfRestAfter6DaysOfWork, checkIfThisWorkDayHasNightShift, checkIfThisWorkDayHasShiftWorkDay, checkIfthisShiftIsNightShift, getShiftFromWorkDay } from '@/src/validations';
import { $Enums, WorkDay } from '@prisma/client';

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
  workDays: WorkDay[],
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
    const rosterAvailablesToChange = await prisma.roster.findFirst({
      where: {
        departmentId: user.departmentId,
        blockChanges: false
      }
    });
    if (!rosterAvailablesToChange) {
      return {
        code: 404,
        message: 'Não há escalas disponíveis para alteração'
      };
    }


    if(user.block_changes){
      return {
        code: 403,
        message: 'Usuário não tem permissão para alterar turnos'
      };
    }

    const shifts = await prisma.shift.findMany();

    const countShiftsOnWorkDays = shifts.map((shift) => {
      const count = workDays.reduce((acc, workDay) => {
        return workDay.shiftsId.includes(shift.id) ? acc + 1 : acc;
      }, 0);
      return {
        ...shift,
        necessaryQnt: shift.minQuantity,
        isLessThanNecessary: count < shift.minQuantity,
        howManyLess: shift.minQuantity - count
      }
    });

    const hasAtLeastOneShiftLessThanNecessary = countShiftsOnWorkDays.some((shift) => shift.isLessThanNecessary);
    if (hasAtLeastOneShiftLessThanNecessary) {
      return {
        code: 400,
        message: `Você precisa de pelo menos ${countShiftsOnWorkDays.filter((shift) => shift.isLessThanNecessary).map((shift) => `${shift.howManyLess} ${shift.name}`).join(', ')}`,
      };
    }

    const allWorkDays = (await prisma.workDay.findMany({
      where: {
        userId: user.id
      },
      orderBy:{
        day:'asc'
      }
    })).map((workDay) => {
      const hasWorkDayToSubstituteAndCheck = workDays.find((workDayToCheck) => {
        return handleisSameDate(workDay.day, workDayToCheck.day);
      })
      if(hasWorkDayToSubstituteAndCheck){
        return hasWorkDayToSubstituteAndCheck
      }

      return workDay;
    })

    const numberOfDaysInRosterMonth = createWorkDaysColumn(rosterAvailablesToChange)
    const monthFromRoster = getMonthFromRosterInNumber(rosterAvailablesToChange)

    const IndexOfDayOfWorkThatComplete6Days:number[] = []
    const notRespectedHoursOfRes:ErrorTypes[] = []

    const countDaysOfWorkInARow = numberOfDaysInRosterMonth.reduce((acc, dayOfWork) => {
       var isSequenciDay = false
       const today =  allWorkDays.find(workDayFromAllWorkDays => workDayFromAllWorkDays.day.getDate() === dayOfWork && workDayFromAllWorkDays.day.getMonth() === monthFromRoster)
      const isNightShiftToday = today && checkIfThisWorkDayHasNightShift(today,shifts)

      const tomorrow = allWorkDays.find(workDayFromAllWorkDays => workDayFromAllWorkDays.day.getDate() === dayOfWork+1 && workDayFromAllWorkDays.day.getMonth() === monthFromRoster)
      const yesterday = allWorkDays.find(workDayFromAllWorkDays => workDayFromAllWorkDays.day.getDate() === dayOfWork-1 && workDayFromAllWorkDays.day.getMonth() === monthFromRoster)
      const isNightShiftYesterDay = yesterday && checkIfThisWorkDayHasNightShift(yesterday,shifts)

      if(today && tomorrow){
        const hasSequence = tomorrow.day.getDate() - 1 === today.day.getDate()? true : false
        isSequenciDay = hasSequence
      }
      if(today && !tomorrow && isNightShiftToday){
        const hasSequence = true
        isSequenciDay = hasSequence
      }
      if(!today && tomorrow && isNightShiftYesterDay){
        const hasSequence = true
        isSequenciDay = hasSequence
      }
      if(!today && !tomorrow && isNightShiftYesterDay){
        const hasSequence = false
        isSequenciDay = hasSequence
      }
      if(!today && tomorrow && !isNightShiftYesterDay){
        isSequenciDay = false
      }
      if(acc+1 === 6) {
        IndexOfDayOfWorkThatComplete6Days.push(dayOfWork)
        const has48HoursOfRestAfter = checkIfHas48HoursOfRestAfter6DaysOfWork({
          allWorkDays,
          date: dayOfWork,
          rosterAvailablesToChange,
          shifts
        })
        if(!has48HoursOfRestAfter){
          notRespectedHoursOfRes.push({
            code:400,
            message: `Você precisa de pelo menos 48h de descanso após seis dias de trabalho em escala operacional consecultivos.`
          })
        }
      
      }
      if(acc > 6 ) return acc


      if(isSequenciDay){
        return acc+1
      }
      return acc = 0
    }
    , 0);

    if(countDaysOfWorkInARow > 6){
      return {
        code: 400,
        message: `Você não pode trabalhar mais de 6 dias seguidos. Você Completou seis dias de trabalho no dia: ${IndexOfDayOfWorkThatComplete6Days[0]}`
      }
    }
    //todo do the 48h of rest after the last shift
  


    const workDaysWithoutId = workDays.filter((workDay) => !workDay.id || workDay.id === '0');
    const workDaysToCreate = workDaysWithoutId.map((workDay) => {
      return {
        day: workDay.day,
        userId: user.id,
        shiftsId: {
            set:workDay.shiftsId.filter((shiftId) => shiftId !== '0') 
        } ,
        departmentId: user.departmentId,
        rosterId: [rosterAvailablesToChange.id]
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
                push: rosterAvailablesToChange.id
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
