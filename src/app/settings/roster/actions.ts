"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { $Enums, Prisma, Roster } from "@prisma/client"
import { getUserByEmail } from "../../login/_actions"
import { getMonthFromRosterInNumber } from "@/src/lib/utils"


export async function getRosters(quantityToFetch=1000):Promise<Roster[] | ErrorTypes>{
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
    const email = session.user.email
    try{
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
        prisma.$disconnect();
            return {
                code: 404,
                message: "Usuário não encontrado"
            }
        }
        if(user.role !== "ADMIN"){
        prisma.$disconnect();
            return {
                code: 403,
                message: "Usuário não autorizado"
            }
        }

    
        const rosters = await prisma.roster.findMany({
            where:{
                departmentId: user.departmentId
            },
            take:quantityToFetch
        })
        prisma.$disconnect();
        return rosters
    }catch(e){
        return {
            code: 500,
            message: "Erro ao buscar escalas"
        }
    }
}

export async function createOrUpdateRoster(roster:Roster):Promise<Roster | ErrorTypes>{
    try{
        const session = await auth()
        if(!session){
            return {
                code: 401,
                message: "Usuário não autenticado"
            }
        }
        const email = session.user.email
        const user = await getUserByEmail(email)
        if("code" in user){
            return{
                code: 404,
                message: user.message
            
            }
        }
        if(user.role !== "ADMIN"){
            return {
                code: 403,
                message: "Usuário não autorizado"
            }
        }
        const rosterCreated = await prisma.roster.upsert({
            where:{
                id:roster.id
            },
            update:{
                ...roster
            },
            create:{
                ...roster,
                departmentId: user.departmentId
            }
        })
        prisma.$disconnect();
        return rosterCreated
    }catch(e){
        return {
            code: 500,
            message: "Erro ao criar ou atualizar escala"
        }
    }
}

export async function createOrUpdateManyRosters(rosters:Roster[]):Promise<ErrorTypes>{
    try{
        const session = await auth()
        if(!session){
            return {
                code: 401,
                message: "Usuário não autenticado"
            }
        }
        const email = session.user.email
        const user = await getUserByEmail(email)
        if("code" in user){
            return{
                code: 404,
                message: user.message
            
            }
        }
        if(user.role !== "ADMIN"){
            return {
                code: 403,
                message: "Usuário não autorizado"
            }
        }

        const registeredNormalUsers = await prisma.user.findMany({
            where: {
                departmentId: user.departmentId,
                role: "USER"
            }
        })
        if(!registeredNormalUsers || registeredNormalUsers.length === 0){
            prisma.$disconnect()
            return {
                code: 403,
                message: "Não é possível criar uma escala sem usuários cadastrados"
            }
        }
        const allusers = await prisma.user.findMany({
            where: {
                departmentId: user.departmentId,
            }
        })
        if(!allusers || allusers.length === 0){
            prisma.$disconnect()
            return {
                code: 403,
                message: "Não é possível criar uma escala sem usuários cadastrados"
            }
        }
        const shifts = await prisma.shift.findMany({
            where:{
                departmentId: user.departmentId
            }
        })
        if(shifts.length === 0){
            return {
                code: 404,
                message: "Nenhuma turno encontrado, adicione os turnos antes de criar as escalas"
            }
        }
        const users = await prisma.user.findMany({
            where:{
                departmentId: user.departmentId
            }
        })
        if(users.length === 0){
            return {
                code: 404,
                message: "Nenhum usuário encontrado, adicione os usuários antes de criar as escalas"
            }
        }

        
       


        const rostersCreated = await Promise.all(rosters.map(async roster => {
            const oneDay = 24*60*60*1000;
        const numberOfDaysInMonth = Math.floor((new Date(roster.year, getMonthFromRosterInNumber({year: roster.year, month: roster.month as $Enums.Months} as Roster) + 1, 0).getTime() - new Date(roster.year, getMonthFromRosterInNumber({year: roster.year, month: roster.month as $Enums.Months} as Roster)).getTime()) / oneDay);
        
        const workDays:Prisma.WorkDayCreateManyRosterInput[] = []
        
        allusers.forEach(user=>{
            Array.from({length:numberOfDaysInMonth},(_,index)=>(
                workDays.push({
                day: new Date(roster.year,getMonthFromRosterInNumber({year:roster.year,month:roster.month as $Enums.Months} as Roster),index+1),
                userId:user.id,
                departmentId:user.departmentId,
                shiftsId: []
            })))
        })
        const rosterThatAlreadyExists = await prisma.roster.findFirst({
            where:{
                departmentId: user.departmentId,
                month:{
                    equals: roster.month
                },
                year:{
                    equals: roster.year

                }
            }
        })

        if(rosterThatAlreadyExists){
            const updateRoster = await prisma.roster.update({
                where:{
                    id:rosterThatAlreadyExists.id
                },
                data:{
                    rosterLpnaId: roster.rosterLpnaId,
                }
            })
            return updateRoster
        }

        const rosterCreated = await prisma.roster.create({
            data:{
                ...roster,
                departmentId: user.departmentId,
                workDays:{
                    createMany:{
                        data: workDays
                    }
                }
            }
        
        })
        return rosterCreated
           
        }))

        if(rostersCreated.length === 0){
            return {
                code: 404,
                message: "Nenhuma escala encontrada"
            }
        }
        if(rostersCreated.length < rosters.length){
            return {
                code: 401,
                message: "Apenas algmas escalas foram criadas ou atualizadas"
            }
        }

        return {
            code: 200,
            message: "Escalas criadas ou atualizadas com sucesso"
        }
        
    }catch(e){
        console.log(e)
        return {
            code: 500,
            message: "Erro ao criar ou atualizar escalas"
        }
    }
}
export async function getRostersBySession():Promise<Roster[] | ErrorTypes>{
    try{
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
  const user = await getUserByEmail(session.user.email)
        if("code" in user){
            return{
                code: 404,
                message: user.message
            
            }
        }
      

    
        const rosters = await prisma.roster.findFirst({
            where:{
                departmentId: user.departmentId,
                blockChanges: false
            }
        })
        if(!rosters){
            return []
        }
        prisma.$disconnect();
        return [rosters]
    }catch(e){
        return {
            code: 500,
            message: "Erro ao buscar escalas"
        }
    }
}
export async function getRostersById(id:string):Promise<Roster[] | ErrorTypes>{
    try{
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
    const email = session.user.email
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
        prisma.$disconnect();
            return {
                code: 404,
                message: "Usuário não encontrado"
            }
        }
        if(user.role !== "ADMIN"){
        prisma.$disconnect();
            return {
                code: 403,
                message: "Usuário não autorizado"
            }
        }

    
        const rosters = await prisma.roster.findUnique({
            where:{
                departmentId: user.departmentId,
                id
            }
        })
        if(!rosters){
            return []
        }
        prisma.$disconnect();
        return [rosters]
    }catch(e){
        return {
            code: 500,
            message: "Erro ao buscar escalas"
        }
    }
}