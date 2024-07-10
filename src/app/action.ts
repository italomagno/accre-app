"use server"

import { Shift, Roster, WorkDay, User } from "@prisma/client"
import { auth } from "../lib/auth"
import prisma from "../lib/db/prisma/prismaClient"
import { getUserByEmail } from "./login/_actions"
import { ErrorTypes } from "../types"

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
        const shifts = await prisma.shift.findMany({
            where:{
                departmentId: user.departmentId
            }
        })
    
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
    
