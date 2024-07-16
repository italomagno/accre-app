'use server';

import { getUserByEmail } from '@/src/app/login/_actions';
import { auth } from '@/src/lib/auth';
import prisma from '@/src/lib/db/prisma/prismaClient';
import { createWorkDaysColumn, getMonthFromRosterInNumber } from '@/src/lib/utils';
import { ErrorTypes } from '@/src/types';
import {  checkIfHas48HoursOfRestAfter6DaysOfWork, checkIfThisWorkDayHasNightShift} from '@/src/validations';
import {  Roster, User, WorkDay } from '@prisma/client';
import { revalidatePath } from 'next/cache';



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

    const workDayProposal ={
      day:new Date(roster.year,getMonthFromRosterInNumber(roster),day),
      userId:user.id,
      departmentId:user.departmentId,
      rosterId:roster.id,
      shiftsId:shifts.map(shift=>shift.id)
    } 

    const workDayExist = await prisma.workDay.findFirst({
      where:{
       day:workDayProposal.day,
      departmentId:user.departmentId,
      rosterId:roster.id,
      userId:user.id
      }
    })


    const workDaysFromUser = (await prisma.workDay.findMany({
      where:{
        userId:user.id,
        rosterId:roster.id,
      },
      orderBy:{
        day:'asc'
      }
    })).map(workDay=>{
      const isSameDate = workDay.day.getDate() === workDayExist?.day.getDate()
      const isSameMonth = workDay.day.getMonth() === workDayExist?.day.getMonth()
      const isSameYear = workDay.day.getFullYear() === workDayExist?.day.getFullYear()

      if(isSameDate && isSameMonth && isSameYear){
        workDay.shiftsId = workDayProposal.shiftsId
        return workDay
      }
      return workDay}
    )
    
   



    const fatigueRules = await checkFatigueRules(user,workDaysFromUser,roster)
    if(fatigueRules.code !== 200){
      return{
        code:400,
        message:fatigueRules.message
      }
    }

    if(!workDayExist){
      const createdWorkDay = await prisma.workDay.create({
        data:{
          day:new Date(roster.year,getMonthFromRosterInNumber(roster),day),
          userId:user.id,
          departmentId:user.departmentId,
          rosterId:roster.id,
          shiftsId:{
            set: shifts.map(shift=>shift.id)
          }
        }
      })
    //revalidatePath("/")

      return {
        code:200,
        message:'Turno salvo com sucesso'
      }
    }else{
      const updatedWorkDay = await prisma.workDay.update({
        where:{
          id:workDayExist.id,
          userId:user.id,
          day:new Date(roster.year,getMonthFromRosterInNumber(roster),day)
        },
        data:{
          shiftsId:{
            set: shifts.map(shift=>shift.id)
          }
        }
      })
      revalidatePath("/")
      return {
        code:200,
        message:'Turno salvo com sucesso'
      }
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
  rosterId:string,
  hasRestrictions:boolean = true
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
      where:{
        id:rosterId
      }
    })
    if(!rosterAvailablesToChange){
      return {
        code: 404,
        message: 'Escala não encontrada'
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

    const hasAtLeastOneShiftLessThanNecessary = hasRestrictions ? countShiftsOnWorkDays.some((shift) => shift.isLessThanNecessary) : false;
    if (hasAtLeastOneShiftLessThanNecessary) {
      return {
        code: 400,
        message: `Você precisa de pelo menos ${countShiftsOnWorkDays.filter((shift) => shift.isLessThanNecessary).map((shift) => `${shift.howManyLess} ${shift.name}`).join(', ')}`,
      };
    }
    const workSorted = workDays.sort((a, b) => { return a.day.getTime() - b.day.getTime() });

    const fatigueRules = hasRestrictions ? await checkFatigueRules(user,workSorted,rosterAvailablesToChange) : {code:200,message:'Regras de fadiga desativadas'}
    if(fatigueRules.code !== 200){
      return{
        code:400,
        message:fatigueRules.message
      }
    }

    const workDaysWithoutId = workSorted.filter((workDay) => !workDay.id || workDay.id === '0');

   
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
    
  
    revalidatePath("/")

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


async function checkFatigueRules(user:User,workDaysFromUser:WorkDay[],rosterAvailablesToChange:Roster){
  const shifts = await prisma.shift.findMany({
    where:{
      departmentId:user.departmentId
    }
  })

  const allWorkDays = workDaysFromUser

  /* (await prisma.workDay.findMany({
    where: {
      userId: user.id,
      roster:{
        month:{
          not:rosterAvailablesToChange.month
        }
      }
    },
    orderBy:{
      day:'asc'
    }
  }))
  .map(workDayFromAllWorkDaysAvalable=>{
    const workDayFromUser = workDaysFromUser.find(workday=> workDayFromAllWorkDaysAvalable.day.getDate() === workday.day.getDate() && workDayFromAllWorkDaysAvalable.day.getMonth() === workday.day.getMonth() && workDayFromAllWorkDaysAvalable.day.getFullYear() === workday.day.getFullYear())
    if(!workDayFromUser) return workDayFromAllWorkDaysAvalable
    return workDayFromUser
  })
  .sort((a, b) => {
    const dateA = new Date(a.day);
    const dateB = new Date(b.day);
    return dateA.getTime() - dateB.getTime();
}); */



  const numberOfDaysInRosterMonth = createWorkDaysColumn(rosterAvailablesToChange)
  const monthFromRoster = getMonthFromRosterInNumber(rosterAvailablesToChange)

  const IndexOfDayOfWorkThatComplete6Days:number[] = []
  const notRespectedHoursOfRes:ErrorTypes[] = []

numberOfDaysInRosterMonth.reduce((acc, dayOfWork) => {
    var isSequenciDay = false
    const workDaytoday =  allWorkDays.find(workDayFromAllWorkDays => workDayFromAllWorkDays.day.getDate() === dayOfWork && workDayFromAllWorkDays.day.getMonth() === monthFromRoster)
    const workDayTomorrow = allWorkDays.find(workDayFromAllWorkDays => workDayFromAllWorkDays.day.getDate() === dayOfWork+1 && workDayFromAllWorkDays.day.getMonth() === monthFromRoster)
    const workDayYesterDay = allWorkDays.find(workDayFromAllWorkDays => workDayFromAllWorkDays.day.getDate() === dayOfWork-1 && workDayFromAllWorkDays.day.getMonth() === monthFromRoster)

    const today = workDaytoday && workDaytoday.shiftsId.map(shiftId=>{
      const shift = shifts.find(shiftFromVector=> shiftFromVector.id === shiftId)
      if(!shift) return '0'
      const isAbsence = shift.isAbscence
      if(isAbsence) return '0'
      return shiftId
    }).filter(shift=>shift !== "0").length>0
    const tomorrow = workDayTomorrow && workDayTomorrow.shiftsId.map(shiftId=>{
      const shift = shifts.find(shiftFromVector=> shiftFromVector.id === shiftId)
      if(!shift) return '0'
      const isAbsence = shift.isAbscence
      if(isAbsence) return '0'
      return shiftId
    }).filter(shift=>shift !== "0").length>0
    const yesterday = workDayYesterDay && workDayYesterDay.shiftsId.map(shiftId=>{
      const shift = shifts.find(shiftFromVector=> shiftFromVector.id === shiftId)
      if(!shift) return '0'
      const isAbsence = shift.isAbscence
      if(isAbsence) return '0'
      return shiftId
    }).filter(shift=>shift !== "0").length>0
     
     const isNightShiftToday = today && checkIfThisWorkDayHasNightShift(workDaytoday,shifts)
    const isNightShiftYesterDay = yesterday && checkIfThisWorkDayHasNightShift(workDayYesterDay,shifts)
    const lessThan6days = acc <= 6
    if(today && tomorrow && !isNightShiftToday && !isNightShiftYesterDay && lessThan6days){
      const hasSequence = workDayTomorrow.day.getDate() - 1 === workDaytoday.day.getDate()? true : false
      isSequenciDay = hasSequence
    }
    if(today && !tomorrow && isNightShiftYesterDay && lessThan6days ){
      notRespectedHoursOfRes.push({
        code:400,
        message: `Você não pode trabalhar após turnos noturnos.`
      })
    }

    if(today && tomorrow && isNightShiftToday&& lessThan6days){
      notRespectedHoursOfRes.push({
        code:400,
        message: `Você não pode trabalhar após turnos noturnos.`
      })
    }
    if(today && !tomorrow && isNightShiftToday&& lessThan6days){
      const hasSequence = true
      isSequenciDay = hasSequence
    }
    if(!today && tomorrow && isNightShiftYesterDay&& lessThan6days){
      const hasSequence = true
      isSequenciDay = hasSequence
    }
    if(!today && !tomorrow && isNightShiftYesterDay&& lessThan6days){
      const hasSequence = false
      isSequenciDay = hasSequence
    }
    if(!today && tomorrow && !isNightShiftYesterDay&& lessThan6days){
      isSequenciDay = false
    }
    if(acc === 6) {
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


  if(IndexOfDayOfWorkThatComplete6Days.length>0){
    return {
      code: 400,
      message: `Você não pode trabalhar mais de 6 dias seguidos. Você Completou seis dias de trabalho no dia: ${IndexOfDayOfWorkThatComplete6Days[0]}`
    }
  }
  if(notRespectedHoursOfRes.length > 0){
    return notRespectedHoursOfRes[0]
  }

  return {
    code: 200,
    message: `Regras de fadiga respeitadas`
  }

}