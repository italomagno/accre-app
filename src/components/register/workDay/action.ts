"use server"

import { getUserByEmail } from "@/src/app/login/_actions";
import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/db/prisma/prismaClient";
import { ErrorTypes } from "@/src/types";
import { RegisterOrUpdateValues } from "@/src/validations";

export async function registerOrUpdateWorkDay(data: RegisterOrUpdateValues):Promise<ErrorTypes>{
    const { workdayId, shiftId1, shiftId2,day } = data
    try{
        const session = await auth();
        if(!session){
            return {
                code: 401,
                message: "Usuário não autenticado"
            }
        }
        const shiftId1Exists = await prisma.shift.findUnique({
            where: {
                id: shiftId1
            }
        })
        if(!shiftId1Exists){
            return {
                code: 404,
                message: "Selecione um turno válido"
            }
        }
        const user = await getUserByEmail(session.user.email);
        if("code" in user){
            return {
                code: user.code,
                message: user.message
            }
        }
        const usersIdsInThisWorkDay = await prisma.workDay.findUnique({
            where: {
                id: workdayId,
                departmentId: user.departmentId
            },
            })
        const usersIds:string[] = []
        const shiftIds:string[] = shiftId2? [shiftId1,shiftId2] : [shiftId1]
        if(usersIdsInThisWorkDay){
            usersIds.push(...usersIdsInThisWorkDay.usersIds)
            shiftIds.push(...usersIdsInThisWorkDay.shiftsId)
        }

        
        const WorkDay = await prisma.workDay.upsert({
            where: {
                usersIds:{
                    hasSome: [user.id]
                },
                shiftsId:{
                    hasSome: [shiftId1, shiftId2]
                },
                id: workdayId
            },
            update: {
                shiftsId: {
                    set: shiftIds
            }
        },
            create: {
                day,
                usersIds: {
                    set: [...usersIds,user.id]
                },
                shiftsId: shiftIds,
                departmentId: user.departmentId
            }
        });
        
        return {
            code: 200,
            message: "Turno salvo com sucesso"
        }


    }catch(e){
        console.log(e)
        return {
            code: 500,
            message: "Erro ao salvar turno"
        }
    }
    
}