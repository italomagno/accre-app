"use server"
import { Function, User } from '@prisma/client';
import prisma from "@/src/lib/db/prisma/prismaClient";
import { ErrorTypes, RegisterUserValues } from "@/src/types";

export async function getDepartments(){
    try {
        const departments = await prisma.department.findMany();
        return departments ?? [];
    }catch(err){
        return [];
    }
    
}

export async function registerUser(data: RegisterUserValues):Promise<User | ErrorTypes>{
    try {
        const user = await prisma.user.create({
            data:{
                name: data.name,
                email: data.email,
                cpf: data.CPF,
                saram: data.saram,
                role: "USER",
                departmentId: data.departmentId,
                function: data.function as Function
            }
        });
        if(!user){
            return {
                code: 500,
                message: "Usuário não cadastrado."
            
            }
        }
        return user;
    }catch(err){
        console.log(err)
        return {
            code: 500,
            message: `Usuário já cadastrado.  ${err}`
        };
    }
    
}