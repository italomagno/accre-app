"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes } from "@/src/types"
import { User } from "next-auth"
import { getUserByEmail } from "../../login/_actions"
import { revalidatePath } from "next/cache"


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
      prisma.$disconnect();
      return {
        code: 404,
        message: "Usuário não encontrado"
      }
    }
    if(admin.role !== "ADMIN"){
      prisma.$disconnect();
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
          contains: query.toLowerCase(),
          mode: "insensitive"
        }
        },
        {
        email:{
          contains: query.toLowerCase(),
          mode: "insensitive"
        }
        },
      ]
      },
      select:{
      id:true,
      email:true,
      name: true,
      function: true,
      role: true,
      block_changes: true,
      isOffice: true,
      }
    })
    if(!users || users.length === 0){
      prisma.$disconnect();
      return{
        code: 403,
        message: "Não há usuários cadastrados"
      }
    }

    prisma.$disconnect();

    return users
  } catch(e){
    prisma.$disconnect();

    return {
      code: 500,
      message: "Erro ao buscar usuários"
    }
  }

}
export async function getUsersThatIsNotApproved():Promise<ErrorTypes|User[]>{
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
      prisma.$disconnect();
      return {
        code: 404,
        message: "Usuário não encontrado"
      }
    }
    if(admin.role !== "ADMIN"){
      prisma.$disconnect();
      return {
        code: 403,
        message: "Usuário não autorizado"
      }
    }
    const users = await prisma.user.findMany({
      where:{
      departmentId: admin.departmentId,
      isApproved: false
    }})
    if(!users || users.length === 0){
      prisma.$disconnect();
      return{
        code: 403,
        message: "Não há usuários cadastrados"
      }
    }

    prisma.$disconnect();

    return users
  } catch(e){
    prisma.$disconnect();

    return {
      code: 500,
      message: "Erro ao buscar usuários"
    }
  }

}
export async function saveUserApproval(id:string):Promise<ErrorTypes>{
  try{
    const session = await auth()
    if(!session){
      return {
        code: 401,
        message: "Usuário não autenticado"
      }
    }
    const email = session.user.email
    const admin = await getUserByEmail(email)
    if("code" in admin){
      return admin
    }
    if(admin.role !== "ADMIN"){
      return {
        code: 403,
        message: "Usuário não autorizado"
      }
    }
    const user = await prisma.user.update({
      where:{
        id
      },
      data:{
        isApproved: true
      }
    })
    prisma.$disconnect();
    revalidatePath("/settings/users")
    return {
      code: 200,
      message: "Usuário aprovado com sucesso"
    }
  } catch(e){
    prisma.$disconnect();
    return {
      code: 500,
      message: "Erro ao aprovar usuário"
    }
  }
}
export async function deleteUserById(id:string):Promise<ErrorTypes>{
  try{
    const session = await auth()
    if(!session){
      return {
        code: 401,
        message: "Usuário não autenticado"
      }
    }
    const email = session.user.email
    const admin = await getUserByEmail(email)
    if("code" in admin){
      return admin
    }
    if(admin.role !== "ADMIN"){
      return {
        code: 403,
        message: "Usuário não autorizado"
      }
    }
    const user = await prisma.user.delete({
      where:{
        id
      }
    })
    prisma.$disconnect();
    revalidatePath("/settings/users")
    return {
      code: 200,
      message: "Usuário removido com sucesso"
    }
  } catch(e){
    prisma.$disconnect();
    return {
      code: 500,
      message: "Erro ao remover usuário"
    }
  }
}


export async function getAllusers():Promise<ErrorTypes|User[]>{
  try{
    const session = await auth()
    if(!session){
      return {
        code: 401,
        message: "Usuário não autenticado"
      }
    }
    const email = session.user.email
    const admin = await getUserByEmail(email)
    if("code" in admin){
      return admin
    }
 
    const users = await prisma.user.findMany({
      where:{
        departmentId: admin.departmentId
      },
    })
    if(!users || users.length === 0){
      prisma.$disconnect();
      return{
        code: 403,
        message: "Não há usuários cadastrados"
      }
    }
    prisma.$disconnect();
    return users
  }catch(e){
    prisma.$disconnect();
    return {
      code: 500,
      message: "Erro ao buscar usuários"
    }
  }

}
export async function removeUser(id:string):Promise<ErrorTypes>{
  try{
    const session = await auth()
    if(!session){
      return {
        code: 401,
        message: "Usuário não autenticado"
      }
    }
    const email = session.user.email
    const admin = await getUserByEmail(email)
    if("code" in admin){
      return admin
    }
    if(admin.role !== "ADMIN"){
      return {
        code: 403,
        message: "Usuário não autorizado"
      }
    }
    const howManyAdmins = await prisma.user.count({
      where:{
        departmentId: admin.departmentId,
        role: "ADMIN"
      }
    })
    if(howManyAdmins === 1){
      return {
        code: 403,
        message: "Não é possível remover o único administrador do departamento"
      }
    }
    await prisma.workDay.deleteMany({
      where:{
        userId: id
      }
    })
    const user = await prisma.user.delete({
      where:{
        id,
        departmentId: admin.departmentId
      },
    })
    prisma.$disconnect();
    revalidatePath("/settings/users")
    return {
      code: 200,
      message: "Usuário removido com sucesso"
    }
  } catch(e){
    prisma.$disconnect();
    console.log(e)
    return {
      code: 500,
      message: "Erro ao remover usuário"
    }
  }
}