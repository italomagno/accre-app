"use server"
import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { getUserByEmail } from "../../login/_actions"
import { revalidatePath } from "next/cache"
import { Prisma, Shift } from "@prisma/client"


export async function getShifts(){
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
            departmentId: user.departmentId
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
    const isUserSupervisor = user.function === "SUP"
    const isUserAdmin = user.role === "ADMIN"
    const abscences = isUserAdmin ? shifts.filter(shift=>shift.isAbscence === true ) : isUserSupervisor ? shifts.filter(shift=>shift.isAbscence === true ) :shifts.filter(shift=>shift.isAbscence === true && !shift.isOnlyToSup)
    const shiftsWithouAbscence =isUserAdmin ?shifts.filter(shift=>shift.isAbscence === false ):  isUserSupervisor ? shifts.filter(shift=>shift.isAbscence === false ) : shifts.filter(shift=>shift.isAbscence === false && !shift.isOnlyToSup)

  return {
        shifts: shiftsWithouAbscence,
        absences: abscences
  }

}

export async function createOrUpdateManyShifts(shifts:Shift[]):Promise<ErrorTypes>{
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
                message: "Não é possível criar um turno sem usuários cadastrados"
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
                message: "Não é possível criar um turno sem usuários cadastrados"
            }
        }
        if(!shifts || shifts.length === 0){
            prisma.$disconnect()
            return {
                code: 403,
                message: "Não é possível criar um turno sem usuários cadastrados"
            }
        }
        const createOrUpdatedShifts = await Promise.all( shifts.map(async shift => {
            const newShift: Prisma.ShiftCreateInput = {
                minQuantity: shift.minQuantity ?? 0,
                quantity: shift.quantity ?? 1,
                quantityInWeekEnd: shift.quantityInWeekEnd ?? 0,
                minQuantityInWeekEnd: shift.minQuantityInWeekEnd ?? 0,
                maxQuantity: shift.maxQuantity ?? 0,
                department: {
                    connect: {
                        id: user.departmentId
                    }
                },
                start: shift.start,
                end: shift.end,
                shiftLpnaId: shift.shiftLpnaId,
                isOnlyToSup: shift.isOnlyToSup,
                name: shift.name
            };
            const alreadyExistsThisShift = await prisma.shift.findFirst({
                where: {
                    name: {
                        equals: shift.name
                    },
                    departmentId: user.departmentId
                }
            })
            if(alreadyExistsThisShift){
                return await prisma.shift.update({
                    where: {
                        id: alreadyExistsThisShift.id
                    },
                    data: {
                        shiftLpnaId: shift.shiftLpnaId,
                    }
                })
            }
            return await prisma.shift.create({
                data: newShift
            })
            
        }
        ))


          if (createOrUpdatedShifts.length === 0) {
            return {
              code: 403,
              message: "Não é possível criar ou atualizar turnos"
            };
          }
        


       
        return {
            code: 200,
            message: "Turnos criados ou atualizados com sucesso"
        }
    }
    catch(error){
        console.error(error)
        return {
            code: 500,
            message: "Erro ao criar ou atualizar turnos"
        }
    }
}