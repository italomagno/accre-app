'use server'
import { auth } from "@/src/lib/auth";
import { hashCredential } from "@/src/lib/bcrypt";
import prisma from "@/src/lib/db/prisma/prismaClient";
import { CreateDepartmentAndUserSchema, CreateDepartmentAndUserValues, ErrorTypes } from "@/src/types";
import { Department } from "@prisma/client";



export async function createDepartment(department:CreateDepartmentAndUserValues): Promise<Department | ErrorTypes>{
    try {
         CreateDepartmentAndUserSchema.parse(department);
    if(!department.password){
        return {
            code: 400,
            message: "Erro no cadastro do Órgão, Senha não informada."
        }
    }
        const newDepartment = await prisma.department.create({

            data: {
                name: department.departmentName,
                type: department.type,
                classification: department.classification,
                users: {
                    create: {
                        name: department.name,
                        email: department.email,
                        password: hashCredential(department.password),
                        role: "ADMIN"
                    }
                }
            },
            
            
        });
        if (!newDepartment) {
            await prisma.$disconnect();
            return {
                code: 500,
                message: "Erro de criação de departamento."
            }
        }
        await prisma.$disconnect();
        return newDepartment;
        
    } catch (error) {
        await prisma.$disconnect();
        console.log(error)
        return {
            code:404,
            message:`Erro na criação do Departamento: O usuário, ou o Órgão já foi criado anteriormente.`
        }
        
    }
    

/* 
    const newDepartment = await prisma.department.create({
        data: department,
      


    }); */
   
}

export async function getDepartments(): Promise<Department[] | ErrorTypes>{
    try {
        const departments = await prisma.department.findMany();
        if (!departments) {
            await prisma.$disconnect();
            return {
                code: 500,
                message: "Erro ao buscar departamentos."
            }
        }
        await prisma.$disconnect();
        return departments;
        
    } catch (error) {
        await prisma.$disconnect();
        return {
            code:404,
            message:`Erro ao buscar departamentos.`
        }
        
    }
}

export async function getDepartmentBySession(): Promise<Department | ErrorTypes>{
    try {
        const session = await auth()
        if(!session){
            return {
                code: 404,
                message: "Sessão não encontrada"
            }
        }
       
        const user = await prisma.user.findUnique({
            where:{
                email: session.user.email
            }
        })
       
        if(!user){
            await prisma.$disconnect();
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
            await prisma.$disconnect();
            return {
                code: 404,
                message: "Departamento não encontrado"
            }
        }

        await prisma.$disconnect();
        return department
    } catch (error) {
        await prisma.$disconnect();
        return {
            code: 500,
            message: "Erro ao buscar departamento"
        }
    }
    
}