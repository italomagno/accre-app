"use server"

import { Shift, Roster, WorkDay, User } from "@prisma/client"
import { auth } from "../lib/auth"
import prisma from "../lib/db/prisma/prismaClient"
import { getUserByEmail } from "./login/_actions"
import { ErrorTypes, isErrorTypes } from "../types"

export async function handleFechDataToShiftsTable():Promise<ErrorTypes | {shifts: Shift[], users: User[], rosters: Roster[], WorkDays: WorkDay[]}>{
    try{
        const session = await auth()
        if(!session){
            return {
                code: 401,
                message: "Usuário não está logado"
            }
        }
        const user = await getUserByEmail(session.user.email)
        if("code" in user){
            return {
                code: 404,
                message: user.message
            }
        }
        
        const supShifts = await prisma.shift.findMany({
            where:{
                departmentId: user.departmentId,
                isOnlyToSup: true
            }
        })
        const userIsAdmin = user.role === "ADMIN"
        const userIsSup = user.function === "SUP"
        const opeShifts =  await prisma.shift.findMany({
            where:{
                departmentId: user.departmentId,
                isOnlyToSup: false
            }
        }) 

        const shifts = userIsAdmin ? [...supShifts, ...opeShifts] : userIsSup ? [...supShifts, ...opeShifts] : opeShifts

    
        const users = await prisma.user.findMany({
            where:{
                departmentId: user.departmentId
            },
        })
        const rosters = await prisma.roster.findMany({
            where:{
                departmentId: user.departmentId
            }
        })

        const WorkDays = await prisma.workDay.findMany({
            where:{
                departmentId: user.departmentId
            }
        })
 
      
       
        return {
                shifts,
                users,
                rosters,
                WorkDays
    }
        

    }catch(e){
        prisma.$disconnect()
        console.log(e)
        return{
            code: 500,
            message: "Erro interno"
        }
    }
}


export  const downloadCSV = async (header:string[], data:any[], filename = 'data.csv') => {
    
   try {
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não está logado"
        }
    }
    const user = await getUserByEmail(session.user.email)
    const isErrorInUser = isErrorTypes(user)
    if(isErrorInUser){
        return {
            code: user.code,
            message: user.message
        }
    }
    const userIsAdmin = user.role === "ADMIN"
    if(!userIsAdmin){
        return {
            code: 401,
            message: "Usuário não autorizado"
        }
    }

    const csvContent = [
        header.join(','), 
        ...data.map(row => row.join(',')) 
      ].join('\n');
    

      return {
            code: 200,
            message: "Download feito com sucesso",
            data: {
                csvContent,
                filename
            }
        }

    
   } catch (error) {
       console.error(error)
       return{
              code: 500,
              message: "Erro interno"
       }
    
   }
  };
    
