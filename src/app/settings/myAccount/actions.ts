"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { User } from "@prisma/client"


export async function getUserProfile(): Promise<User | ErrorTypes>{
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
        return {
            code: 404,
            message: "Usuário não encontrado"
        }
    }
    prisma.$disconnect();
    return user

}