'use server'

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes, isErrorTypes } from "@/src/types"
import { $Enums } from "@prisma/client"
import { getUserByEmail } from "../login/_actions"



export async function getUserRole():Promise<$Enums.Role| ErrorTypes> {
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
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
    
    prisma.$disconnect();
    return user.role 
}