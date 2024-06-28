'use server'

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { $Enums } from "@prisma/client"



export async function getUserRole():Promise<$Enums.Role| ErrorTypes> {
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }

    const user = await prisma.user.findUnique({
        where:{
            email:session.user.email
        }
    })
    if(!user){
        prisma.$disconnect();
        return {
            code: 404,
            message: "Usuário não encontrado"
        }
    }
    prisma.$disconnect();
    return user.role 
}