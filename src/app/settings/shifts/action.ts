"use server"
import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { getUserByEmail } from "../../login/_actions"
import { revalidatePath } from "next/cache"


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
export async function getAvailableShifts(){
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
    const shifts = await prisma.shift.findMany({
        where: {
            departmentId: session.user.departmentId,
            isAvailable: true
        }
    })
    if(!shifts || shifts.length === 0){
        prisma.$disconnect()
        return {
            code: 403,
            message: "Não há turnos disponíveis"
        }
    }
    return shifts
}

export async function removeShift(id: string):Promise<ErrorTypes>{
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
    const admin = await getUserByEmail(session.user.email)
    if("code" in admin){
        return {
            code: 403,
            message: admin.message
        }
    }
    
    const shift = await prisma.shift.delete({
        where: {
            id,
            departmentId: admin.departmentId
        }
    })
    prisma.$disconnect()
    revalidatePath("/settings/shifts")
    return{
        code: 200,
        message: "Turno removido com sucesso"
    }
}