'use server';

import { getUserByEmail } from '@/src/app/login/_actions';
import { auth } from '@/src/lib/auth';
import { handleisSameDate } from '@/src/lib/date';
import prisma from '@/src/lib/db/prisma/prismaClient';
import { createWorkDaysColumn, getMonthFromRosterInNumber } from '@/src/lib/utils';
import { ErrorTypes } from '@/src/types';
import {  checkIfHas48HoursOfRestAfter6DaysOfWork, checkIfThisWorkDayHasNightShift} from '@/src/validations';
import {  Roster, Shift, User, WorkDay } from '@prisma/client';



export async function registerOrUpdateWorkDayByAdmin(ShiftNameWithVerticalBar:string,day:number,roster:Roster,user:User){
  try{
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
        code: admin.code,
        message: admin.message
      };
    }
    if(admin.role !== "ADMIN"){
      return {
        code: 403,
        message: 'Usuário não tem permissão para alterar turnos'
      };
    }

    const proposalShift = ShiftNameWithVerticalBar.includes(" | ") ? ShiftNameWithVerticalBar.split(" | ") : [ShiftNameWithVerticalBar]

    const shifts = await prisma.shift.findMany({
      where:{
        departmentId:user.departmentId,
        name:{
          in:proposalShift
        }
      }
    })
  
    const workDaysFromUser = await prisma.workDay.findMany({
      where:{
        userId:user.id,
        rosterId:roster.id
      }
    })
    const workDay = workDaysFromUser.find(workDay=>workDay.day.getDate() === day)


    const fatigueRules = await checkFatigueRules(user,workDaysFromUser,roster,shifts)
    
    if(fatigueRules.code !== 200){
      return{
        code:400,
        message:fatigueRules.message
      }
    }

    if(!workDay){
      const createdWorkDay = await prisma.workDay.create({
        data:{
          day:new Date(roster.year,getMonthFromRosterInNumber(roster)-1,day),
          userId:user.id,
          departmentId:user.departmentId,
          rosterId:roster.id,
          shiftsId:{
            set: shifts.map(shift=>shift.id)
          }
        }
      })
      return {
        code:200,
        message:'Turno salvo com sucesso'
      }
    }


    if(workDay){
      const updatedWorkDay = await prisma.workDay.update({
        where:{
          id:workDay.id,
          userId:user.id,
          day:new Date(roster.year,getMonthFromRosterInNumber(roster)-1,day)
        },
        data:{
          shiftsId:{
            set: shifts.map(shift=>shift.id)
          }
        }
      })

      return {
        code:200,
        message:'Turno salvo com sucesso'
      }
    }

    return {
      code:500,
      message:'Erro ao salvar turno'
    }



  }catch(e){
    console.log(e)
    return {
      code:500,
      message:'Erro ao salvar turno'
    }
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

    const fatigueRules = await checkFatigueRules(user,workDays,rosterAvailablesToChange,shifts)
    if(fatigueRules.code !== 200){
      return{
        code:400,
        message:fatigueRules.message
      }
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
        rosterId: rosterAvailablesToChange.id
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
            rosterId:rosterAvailablesToChange.id,
            
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


async function checkFatigueRules(user:User,workDaysFromUser:WorkDay[],rosterAvailablesToChange:Roster,shifts:Shift[]){
  const allWorkDays = (await prisma.workDay.findMany({
    where: {
      userId: user.id
    },
    orderBy:{
      day:'asc'
    }
  })).map((workDay) => {
    const hasWorkDayToSubstituteAndCheck = workDaysFromUser.find((workDayToCheck) => {
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
    if(today && !tomorrow && isNightShiftYesterDay){
      notRespectedHoursOfRes.push({
        code:400,
        message: `Você não pode trabalhar após turnos noturnos.`
      })
    }

    if(today && tomorrow && isNightShiftToday){
      console.log("oxe entrou?")
      notRespectedHoursOfRes.push({
        code:400,
        message: `Você não pode trabalhar após turnos noturnos.`
      })
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

  return {
    code: 200,
    message: `Regras de fadiga respeitadas`
  }

}