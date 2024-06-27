"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { Roster } from "@prisma/client"


export async function getRosters():Promise<Roster[] | ErrorTypes>{
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
            return {
                code: 404,
                message: "Usuário não encontrado"
            }
        }
        if(user.role !== "ADMIN"){
            return {
                code: 403,
                message: "Usuário não autorizado"
            }
        }

    
        const rosters = await prisma.roster.findMany({
            where:{
                departmentId: user.departmentId
            }
        })
        return rosters
    }catch(e){
        return {
            code: 500,
            message: "Erro ao buscar escalas"
        }
    }
}