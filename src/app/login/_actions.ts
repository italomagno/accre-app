"use server"
import { compareCredential } from '@/src/lib/bcrypt';
import { auth, signIn, signOut } from "@/src/lib/auth";
import prisma from "@/src/lib/db/prisma/prismaClient";
import { ErrorTypes, FormValues, LoginSchema } from "@/src/types";
import { User } from "@prisma/client";

export async function signInOnServerActions(data: FormValues):Promise<ErrorTypes>{
    "use server"
    
    try {
        const result = await LoginSchema.parseAsync(data);
        const email = result.email 
        const password = result.password 
        const userFromDB = await getUser(email, password)
        if("code" in userFromDB){
            return {
                code: 404,
                message: "Usuário ou senha incorretos."
            };
        }
        const resultData = await signIn("credentials", data)


        return {
            code: 200,
            message: "Login efetuado com sucesso. Aguarde Redirecionamento"
        };
     
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
        return {
            code: 500,
            message: "Erro de login"
        };
    }
}

export async function getUser(email: string, password: string): Promise<User | ErrorTypes> {
    try {
        const userHashedPassword = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if(!userHashedPassword){
            return {
                code: 404,
                message: "Email ou senha incorretos."
            };
        }
        
        if(!userHashedPassword.password){
            return {
                code: 404,
                message: "Email ou senha incorretos."
            };
        }
        const isCorrectPassword = compareCredential(password, userHashedPassword.password);
        if(!isCorrectPassword){
            return {
                code: 404,
                message: "Email ou senha incorretos."
            };
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if(!user){
            await prisma.$disconnect();
            return {
                code: 404,
                message: "Usuário não encontrado."
            };
        }
        await prisma.$disconnect();
        return user;
    } catch (error) {
        await prisma.$disconnect();
        return {
            code: 500,
            message: "Erro de busca de usuário."
        };
    }
}
export async function getUserByEmail(email: string): Promise<User | ErrorTypes> {
    const hasAllth = auth();
    if(!hasAllth){
        return {
            code: 401,
            message: "Usuário não autenticado."
        };
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                     email: email 
            }
        });
        if(!user){
            return {
                code: 404,
                message: "Usuário não encontrado."
            };
        }
        return user;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return {
            code: 500,
            message: "Erro de busca de usuário."
        };
    }
}

export async function handleLogOut() {
    try {
        await signOut();
    } catch (error) {
        console.error("Erro ao tentar fazer logout:", error);
    }
}
