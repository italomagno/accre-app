"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { User } from "next-auth"


export async function getUsersWithFilter(query:string):Promise<ErrorTypes|User[]>{
  const session = await auth()
  if(!session){
    return {
      code: 401,
      message: "Usuário não autenticado"
    }
  }
  const email = session.user.email
    
  try{
    const admin = await prisma.user.findUnique({
      where:{
        email
      }
    })
    if(!admin){
      return {
        code: 404,
        message: "Usuário não encontrado"
      }
    }
    if(admin.role !== "ADMIN"){
      return {
        code: 403,
        message: "Usuário não autorizado"
      }
    }
    const users = await prisma.user.findMany({
      where:{
      departmentId: admin.departmentId,
      OR:[
        {
        name:{
          contains: query
        }
        },
        {
        email:{
          contains: query
        }
        },
        {
        saram:{
          contains: query
        }
        },
        {
        cpf:{
          contains: query
        }
        },
      ]
      },
      select:{
        name: true,
        cpf: true,
        saram: true,
        email: true,
        function: true,
        role: true,
        block_changes: true,
        isOffice: true,
      }
    })
    return users
  } catch(e){
    return {
      code: 500,
      message: "Erro ao buscar usuários"
    }
  }

}