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
    const users = await prisma.user.findMany()
    if(!users){
        prisma.$disconnect();
        return {
            code: 404,
            message: "Usuários não encontrados"
        }
    }
    const user = users.find(user => user.email === session.user.email)
  
    if(!user){
        prisma.$disconnect();
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
        prisma.$disconnect();

        return {
            code: 404,
            message: "Órgão não encontrado"
        }
    }
    prisma.$disconnect();
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

    const users = await prisma.user.findMany()
    if(!users){
        prisma.$disconnect();
        return {
            code: 404,
            message: "Usuários não encontrados"
        }
    }
    const user = users.find(user => user.email === session.user.email)
   
    if(!user){
        prisma.$disconnect();
        return {
            code: 404,
            message: "Usuário não encontrado"
        }
    }
    if(user.role !== 'ADMIN'){
        prisma.$disconnect();

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
        prisma.$disconnect();
        return {
            code: 500,
            message: "Erro ao atualizar planilha"
        }
    }
    prisma.$disconnect();
    return {
        code: 200,
        message: "Planilha atualizada com sucesso"
    }

}