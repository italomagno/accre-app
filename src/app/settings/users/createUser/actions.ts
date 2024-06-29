"use server"

import { ErrorTypes, } from "@/src/types"
import { $Enums, User,Function } from "@prisma/client"

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
    return {
        code: 200,
        message: "Usuários cadastrados com sucesso",
        users: users // Add the 'users' property to the object literal
    }

}