"use server"
import { hashCredential } from '@/src/lib/bcrypt';
import { Department, Function, User } from '@prisma/client';
import prisma from "@/src/lib/db/prisma/prismaClient";
import { ErrorTypes, RegisterUserValues } from "@/src/types";

export async function getDepartments(): Promise<Department[] | ErrorTypes>{
    try {
        const departments = await prisma.department.findMany();
        await prisma.$disconnect();
        return departments ?? {
            code: 500,
            message: "Erro ao buscar departamentos."
        };
    }catch(err){
        await prisma.$disconnect();
        return {
            code: 500,
            message: "Erro ao buscar departamentos."
        };
    }
    
}

export async function registerUser(data: RegisterUserValues):Promise<User | ErrorTypes>{
    try {
        const user = await prisma.user.create({
            data:{
                name: data.name,
                email: (data.email),
                password: hashCredential(data.password),
                role: "USER",
                departmentId: data.departmentId,
                function: data.function as Function
            }
        });
        if(!user){
        await prisma.$disconnect();

            return {
                code: 500,
                message: "Usuário não cadastrado."
            
            }
        }
        await prisma.$disconnect();
        return user;
    }catch(err){
        await prisma.$disconnect();

        return {
            code: 500,
            message: `Usuário já cadastrado.  ${err}`
        };
    }
    
}