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
        

        if(workdayId){
            const shiftIds:string[] = shiftId2? [shiftId1,shiftId2] : [shiftId1]
         
            await prisma.workDay.update({
                where: {
                    id: workdayId
                },
                data: {
                    shiftsId: {
                        set: shiftIds
                    }
                }
            
            })
        }else{
            const usersIds:string[] = []
            const shiftIds:string[] = shiftId2? [shiftId1,shiftId2] : [shiftId1]
            await prisma.workDay.create({
                data: {
                    day,
                    user:{
                        connect:{
                            id:user.id
                        }
                    },
                    shifts:{
                        connect: shiftIds.map((shiftId)=>({id:shiftId}))
                    },
                    department:{
                        connect:{
                            id: user.departmentId
                        }
                    }

                },
            })
        }
    
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