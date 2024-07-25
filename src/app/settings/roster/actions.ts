"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { Roster } from "@prisma/client"
import { getUserByEmail } from "../../login/_actions"


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