"use server"


import { auth } from "@/src/lib/auth"
import { handleDateStartEnd } from "@/src/lib/date"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { CreateShiftValues, createShiftSchema } from "@/src/types"
import { Prisma } from "@prisma/client"


export async function createShift(shiftValues: CreateShiftValues){
    try{
        await createShiftSchema.parseAsync(shiftValues)
        //ToDO - Add validation for start, end.
        const session = await auth()
        if(!session){
            return {
                code: 401,
                message: "Usuário não autenticado"
            }
        }
        const newShift: Prisma.ShiftCreateInput= {
            ...shiftValues,
            minQuantity: parseInt(shiftValues.minQuantity?? "0"),
            quantity: parseInt(shiftValues.quantity?? "1"),
            ...handleDateStartEnd(shiftValues.dateStartEnd),
            department: {
                connect: {
                    id: session.user.departmentId
                }
            }
        }
        const shift = await prisma.shift.create({
            data: newShift
        })
        prisma.$disconnect()
        return shift
    }catch(err){
        return {
            code: 500,
            message: "Erro ao criar turno"
        }
    }
   
}