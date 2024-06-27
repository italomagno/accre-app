"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"

export async function getSpreadSheetId(){
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }

    const email = session.user.email
    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!user){
        return {
            code: 404,
            message: "Usuário não encontrado"
        }
    }
    const department = await prisma.department.findUnique({
        where:{
            id: user.departmentId
        }
    })
    if(!department){
        return {
            code: 404,
            message: "Órgão não encontrado"
        }
    }
    return department.spreadSheetId
}
export async function updateSpreadSheetId( spreadSheetId: string):Promise<ErrorTypes>{
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }

    const email = session.user.email
    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!user){
        return {
            code: 404,
            message: "Usuário não encontrado"
        }
    }
    if(user.role !== 'ADMIN'){
        return {
            code: 403,
            message: "Usuário não autorizado"
        }
    }
    const updatedSpreadSheetId = await prisma.department.update({
        where:{
            id: user.departmentId
        },
        data:{
            spreadSheetId: spreadSheetId
        }
    })
    if(!updatedSpreadSheetId){
        return {
            code: 500,
            message: "Erro ao atualizar planilha"
        }
    }

    return {
        code: 200,
        message: "Planilha atualizada com sucesso"
    }

}