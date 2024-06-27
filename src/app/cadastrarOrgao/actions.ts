'use server'
import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/db/prisma/prismaClient";
import { ErrorTypes } from "@/src/types";
import { Department, User } from "@prisma/client";



export async function createDepartment(department:Department): Promise<Department | ErrorTypes>{
    try {
        const newDepartment = await prisma.department.create({
            data: {
                name: department.name,
                spreadSheetId: department.spreadSheetId,
                users: {
                    create: {
                        name: ((department as any ).users as unknown as User).name,
                        email: ((department as any ).users as unknown as User).email,
                        cpf: ((department as any ).users as unknown as User).cpf,
                        saram: ((department as any ).users as unknown as User).saram,
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
        return {
            code:404,
            message:`Erro ao buscar departamentos.`
        }
        
    }
}

export async function getDepartmentBySession(): Promise<Department | ErrorTypes>{
    try {
        const session = await auth()
        const user = await prisma.user.findUnique({
            where:{
                email:session?.user.email
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
                message: "Departamento não encontrado"
            }
        }
        return department
    } catch (error) {
        return {
            code: 500,
            message: "Erro ao buscar departamento"
        }
    }
    
}