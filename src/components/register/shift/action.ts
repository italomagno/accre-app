"use server"
import { getUserByEmail } from '@/src/app/login/_actions';
import { auth } from "@/src/lib/auth"
import { handleDateStartEnd } from "@/src/lib/date"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { CreateShiftValues, createShiftSchema } from "@/src/types"
import { Prisma } from "@prisma/client"
import { revalidatePath } from 'next/cache';


export async function createShift(shiftValues: CreateShiftValues){
    try{
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
        //exclude dateStartEnd from shiftValues


        const {dateStartEnd,...shiftsWithoutDateStartEnd} = shiftValues
        const {start,end} = handleDateStartEnd(dateStartEnd)
        

        const newShift: Prisma.ShiftCreateInput= {
            ...shiftsWithoutDateStartEnd,
            minQuantity: parseInt(shiftValues.minQuantity ?? "0"),
            quantity: parseInt(shiftValues.quantity ?? "1"),
            department: {
                connect: {
                    id: admin.departmentId
                }
            },
            start,
            end,
            isOnlyToSup: shiftValues.isOnlyToSup
        }
        const shift = await prisma.shift.create({
            data: newShift
        })
        prisma.$disconnect()
        revalidatePath("/settings/shifts")
        return shift
    }catch(err){
        console.log(err)
        return {
            code: 500,
            message: "Erro ao criar turno"
        }
    }
   
}