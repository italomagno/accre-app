'use server'

import { getUserByEmail } from "@/src/app/login/_actions";
import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/db/prisma/prismaClient";
import { getMonthFromRosterInNumber } from "@/src/lib/utils";
import { CreateRosterValues, ErrorTypes, UpdateRosterSchema, UpdateRosterValues, createRosterSchema } from "@/src/types";
import { $Enums, Months, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";


export async function createRoster(data:CreateRosterValues):Promise<ErrorTypes>{
    try{
        await createRosterSchema.parseAsync(data)
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

        const registeredNormalUsers = await prisma.user.findMany({
            where: {
                departmentId: admin.departmentId,
                role: "USER"
            }
        })
        if(!registeredNormalUsers || registeredNormalUsers.length === 0){
            prisma.$disconnect()
            return {
                code: 403,
                message: "Não é possível criar uma escala sem usuários cadastrados"
            }
        }
        
        const allusers = await prisma.user.findMany({
            where: {
                departmentId: admin.departmentId,
            }
        })
        if(!allusers || allusers.length === 0){
            prisma.$disconnect()
            return {
                code: 403,
                message: "Não é possível criar uma escala sem usuários cadastrados"
            }
        }
        const hasRegisteredRoster = await prisma.roster.findMany({
            where: {
                departmentId: admin.departmentId,
                month: data.month as Months,
                year: parseInt(data.year)
            }
        })
        if(hasRegisteredRoster && hasRegisteredRoster.length > 0){
            prisma.$disconnect()
            return {
                code: 403,
                message: "Já existe uma escala cadastrada para este mês"
            }
        }
        const oneDay = 24*60*60*1000;
        const numberOfDaysInMonth = Math.floor((new Date(parseInt(data.year), getMonthFromRosterInNumber({year: parseInt(data.year), month: data.month as $Enums.Months}) + 1, 0).getTime() - new Date(parseInt(data.year), getMonthFromRosterInNumber({year: parseInt(data.year), month: data.month as $Enums.Months})).getTime()) / oneDay);
        
        
        const workDays:Prisma.WorkDayCreateManyRosterInput[] = []
        
        allusers.forEach(user=>{
            Array.from({length:numberOfDaysInMonth},(_,index)=>(
                workDays.push({
                day: new Date(parseInt(data.year),getMonthFromRosterInNumber({year:parseInt(data.year),month:data.month as $Enums.Months}),index+1),
                userId:user.id,
                departmentId:admin.departmentId,
                shiftsId: []
            })))
        })

        const registeredShifts = await prisma.shift.findMany({
            where: {
                departmentId: admin.departmentId
            }
        })
        if(!registeredShifts || registeredShifts.length === 0){
            prisma.$disconnect()
            return {
                code: 403,
                message: "Não é possível criar uma escala sem turnos cadastrados"
            }
        }

        const createRosterWithAllUsers = await prisma.roster.create({
            data: {
                month: data.month as Months,
                year: parseInt(data.year),
                minWorkingHoursPerRoster: parseInt(data.minHours),
                maxWorkingHoursPerRoster: parseInt(data.maxHours),
                departmentId: admin.departmentId,
                users: {
                    connect: registeredNormalUsers.map(user => {
                        return {
                            id: user.id
                        }
                    }),
                },
                shifts: {
                    connect: registeredShifts.map(shift => {
                        return {
                            id: shift.id
                        }
                    })
                },
                workDays: {
                    createMany:{data:workDays}
                }
            }
        })
        if(!createRosterWithAllUsers ){
            return {
                code: 500,
                message: "Erro interno no servidor"
            }
        }


        prisma.$disconnect()
    return {
        code: 200,
        message: "Escala criada com sucesso"
    }


    }catch(e){
        return {
            code: 500,
            message: "Erro interno no servidor"
        }
    }



   


    

}


export async function updateRoster(id:string,data:UpdateRosterValues):Promise<ErrorTypes>{

    try{
        await UpdateRosterSchema.parseAsync(data)
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
        const updatedRoster = await prisma.roster.update({
            where:{
                id:id,
                departmentId: admin.departmentId
            },
            data:{
                ...data,
                year:parseInt(data.year),
                month: data.month as Months,
            }
        })
        prisma.$disconnect()
        revalidatePath("/settings/roster")
        return {
            code: 200,
            message: "Escala atualizada com sucesso"
        }

    
    }catch(e){
        return {
            code: 500,
            message: "Erro interno no servidor"
        }
    }
}



export async function removeRoster( id:string){
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

    const deleteAllWorkDays = await prisma.workDay.deleteMany({
        where:{
            rosterId: id
        }
    })


    const deletedRoster = await prisma.roster.delete({
        where:{
            id:id,
            departmentId: admin.departmentId
        },
    })
    if(!deletedRoster){
        prisma.$disconnect()
        return {
            code: 500,
            message: "Erro ao deletar escala"
        }
    }
    prisma.$disconnect()
    return {
        code: 200,
        message: "Escala deletada com sucesso"
    }
}catch(e){
    prisma.$disconnect()
    console.log(e)
    return {
        code: 500,
        message: "Erro interno no servidor"
    }
}
}
