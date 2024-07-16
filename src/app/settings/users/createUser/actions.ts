"use server"
import { auth } from '@/src/lib/auth';
import { hashCredential } from '@/src/lib/bcrypt';

import prisma from "@/src/lib/db/prisma/prismaClient"
import { ErrorTypes, UpdateMyAccountValues, UpdateUserValues, } from "@/src/types"
import { $Enums, User,Function } from "@prisma/client"
import { revalidatePath } from 'next/cache';

type SuccessResponse = ErrorTypes & {
    users:Pick<User, "name" | "email" | "function">[]
}


export async function handleFileInputForManyUsers(prevState:any,formData: FormData):Promise<ErrorTypes | SuccessResponse >{
   const file:File | null = formData.get("file") as File
   if(!file){
       return {
           code: 400,
           message: "Arquivo não encontrado"
       }}
     if(file.size > 1024 * 1024 * 5){
         return {
             code: 400,
             message: "Arquivo muito grande"
         }
     }
        if(!file.name.endsWith('.csv')){
            return {
                code: 400,
                message: "Arquivo deve ser um CSV"
            }
        }
        
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const text = buffer.toString('utf-8')
    const lines = text.split('\n')
    const headers = lines.shift()
    if(!headers){
        return {
            code: 400,
            message: "Arquivo CSV vazio"
        }
    }
    const hasNameOnHeaders = headers.includes('name')
    const hasEmailOnHeaders = headers.includes('email')
    const hasFunctionOnHeaders = headers.includes('function')
    if(!hasNameOnHeaders || !hasEmailOnHeaders || !hasFunctionOnHeaders){
        return {
            code: 400,
            message: "Arquivo CSV deve conter as colunas name e email e Function."
        }
    }
    const indexName = headers.split(',').indexOf('name')
    const indexEmail = headers.split(',').indexOf('email')
    const indexRole = headers.split(',').indexOf('function')


    
    const users = lines.map((line) => {
        const values = line.split(',')
        const userFunction:Function = Object.keys($Enums.Function).includes(values[indexRole]) ? values[indexRole] as Function : "OPE" as Function
        return {
            name: values[indexName],
            email: values[indexEmail],
            function: userFunction as Function
        }
    })

    const filterUsersWithName = users.filter((user) => user.name)
    const usersWithoutEmail = filterUsersWithName.filter((user) => !user.email)
    if(usersWithoutEmail.length > 0){
        return {
            code: 400,
            message: `"Usuários sem email": ${usersWithoutEmail.map((user) => user.name).join(', ')}`
        }
    }
    const usersWithoutFunction = filterUsersWithName.filter((user) => !user.function)
    if(usersWithoutFunction.length > 0){
        return {
            code: 400,
            message: `"Usuários sem função": ${usersWithoutFunction.map((user) => user.name).join(', ')}`
        }
    }

    return {
        code: 200,
        message: "Upload de arquivo CSV bem sucedido",
        users: filterUsersWithName // Add the 'users' property to the object literal
    }

}


export async function createManyUsers(users:Pick<User, "name" | "email" | "function">[]):Promise<ErrorTypes>{
    const session = await auth()
    if(!session){
        prisma.$disconnect()

        return {
            code: 401,
            message: "Usuário não logado"
        }
    }

    const admin = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    })
    if(!admin){
        prisma.$disconnect()
        return {
            code: 401,
            message: "Administrador não encontrado"
        }
    }
    if(admin.role !== "ADMIN"){
        prisma.$disconnect()
        return {
            code: 401,
            message: "Usuário não é administrador"
        }
    }

    const departmentId = admin.departmentId
    if(!departmentId){
        prisma.$disconnect()

        return {
            code: 401,
            message: "Departamento do administrador não encontrado"
        }
    }

    const newUsers= users.map((user) => {
        prisma.$disconnect()
        return {
            ...user,
            role:"USER" as $Enums.Role,
            departmentId: departmentId,
            password: hashCredential("123456789"),
            isApproved: admin?.role === "ADMIN" ? true : false
        }
    })
    try{    
        const alreadyCreatedUsers = await prisma.user.findMany({
            where: {
                email: {
                    in: users.map((user) => user.email)
                }
            }
        })
        if(alreadyCreatedUsers.length > 0){
            prisma.$disconnect()
            return {
                code: 400,
                message: `Usuários já existentes:  ${alreadyCreatedUsers.map((user,i) => ` ( ${i+1} ) nome: ${user.name} e email: ${user.email}`).join(`, \n\n`)}. Remova-os do arquivo CSV e tente novamente.`
            }
        }
        const createdUsers = await prisma.user.createMany({
            data: newUsers
        })
        if(!createdUsers){
        prisma.$disconnect()
            return {
                code: 500,
                message: "Erro ao criar usuários"
            }
        }
        if(createdUsers.count < users.length){
        prisma.$disconnect()
            return {
                code: 500,
                message: `Foram criados apenas ${createdUsers.count} usuários de ${users.length}`
            }
        }
        if(createdUsers.count === users.length){
        prisma.$disconnect()
            return {
                code: 200,
                message: "Usuários criados com sucesso",
            }
        }


        prisma.$disconnect()
        return {
            
            code: 200,
            message: "Usuários criados com sucesso",
        }
    }catch
    (error){
        prisma.$disconnect()
        return {
            code: 500,
            message: "Erro ao criar usuários"
        }
    }


}

export async function updateMyAccount(id:string, data:UpdateMyAccountValues):Promise<ErrorTypes>{

    
    try{
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
    const email = session.user.email
    const user = await prisma.user.findFirst({
        where: {
            email,
            id
        }
    })
    if(!user){
        return {
            code: 401,
            message: "Usuário não encontrado"
        }
    }
    const hashedUserPassword =  hashCredential(data.password)
 
    const updatedUser = await prisma.user.update({
        where: {
            id,
            departmentId: user.departmentId
        },
        data: {
            ...data,
            function: data.function as Function,
            password: hashedUserPassword
        }
    })
    if(!updatedUser){
        return {
            code: 500,
            message: "Erro ao atualizar usuário"
        }
    }

    revalidatePath('/settings/myAccount')

    return {
        code: 200,
        message: "Usuário atualizado com sucesso"
    }

}catch(error){
    console.log(error)
    return {
        code: 500,
        message: "Erro ao atualizar usuário"
    }
}

}


export async function updateUser(id:string, data:UpdateUserValues):Promise<ErrorTypes>{
    try{
        const oldData = data
    const session = await auth()
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
    const email = session.user.email
    const admin = await prisma.user.findFirst({
        where: {
            email
        }
    })
    if(!admin){
        return {
            code: 401,
            message: "Administrador não encontrado"
        }
    }
    if(admin.role !== "ADMIN"){
        return {
            code: 401,
            message: "Usuário não é administrador"
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id,
            departmentId: admin.departmentId
        },
        data: {
            ...data,
            function: data.function as Function,
            role: data.role as $Enums.Role
        }
    })
    if(!updatedUser){
        return {
            code: 500,
            message: "Erro ao atualizar usuário"
        }
    }
    const howManyAdmins = await prisma.user.count({
        where: {
            departmentId: admin.departmentId,
            role: "ADMIN"
        }
    })
    if(howManyAdmins === 0){
        prisma.user.update({
            where: {
                id,
                departmentId: admin.departmentId
            },
            data: {
                role: "ADMIN"
            }
        })
        return {
            code: 403,
            message: "Não é possível remover o único administrador do departamento"
        }
    }

    revalidatePath('/settings/users')

    return {
        code: 200,
        message: "Usuário atualizado com sucesso"
    }

}catch(error){
    console.log(error)
    return {
        code: 500,
        message: "Erro ao atualizar usuário"
    }
}

}