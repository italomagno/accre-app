"use server"
import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { getUserByEmail } from "../../login/_actions"
import { revalidatePath } from "next/cache"
import { Shift } from "@prisma/client"


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

export async function getShiftById(id: string):Promise<ErrorTypes | Shift> {
    try{
        const session = await auth()
        if(!session) return{
            code: 401,
            message: 'Usuário não autenticado'
        }
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        })
        if(!user) return {
            code: 404,
            message: 'Usuário não encontrado'
        }
        const shift = await prisma.shift.findUnique({
            where: {
                id,
                departmentId: user.departmentId
                
            }
        })
        if(!shift) return {
            code: 404,
            message: 'Turno não encontrado'
        }
        return shift
    }catch(error){
        console.error(error)
        return {
            code: 500,
            message: 'Erro ao buscar turno'
        }
    }
}

export async function getShiftsAndAbscence(){
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
    const user = await getUserByEmail(session.user.email)
    if("code" in user){
        return {
            code: 403,
            message: user.message
        }
    }

    const shifts = await prisma.shift.findMany({
        where: {
            departmentId: user.departmentId,
            isAvailable: true
        },

    })
    if(!shifts || shifts.length === 0){
        prisma.$disconnect()
        return {
            code: 403,
            message: "Não há turnos cadastrados"
        }
    }
    const abscences = shifts.filter(shift=>shift.isAbscence === true)
    const shiftsWithouAbscence = shifts.filter(shift=>shift.isAbscence === false)

  return {
        shifts: shiftsWithouAbscence,
        absences: abscences
  }

}