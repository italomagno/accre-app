"use server"
import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"


export async function getShifts(){
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
    const shifts = await prisma.shift.findMany({
        where: {
            departmentId: session.user.departmentId
        }
    })
    if(!shifts || shifts.length === 0){
        prisma.$disconnect()
        return {
            code: 403,
            message: "Não há turnos cadastrados"
        }
    }
    return shifts
}