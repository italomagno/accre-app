"use server"
import { auth, signIn, signOut } from "@/src/lib/auth";
import prisma from "@/src/lib/db/prisma/prismaClient";
import { ErrorTypes, FormValues, LoginSchema } from "@/src/types";
import { User } from "@prisma/client";

export async function signInOnServerActions(data: FormValues){
    "use server"
    try {
        const result = await LoginSchema.parseAsync(data);
        if(result){
            const res = await signIn("credentials", data)
            return {
                code: 200,
                message: "Login efetuado com sucesso"
            };
        } else {
            return {
                code: 500,
                message: "Erro de login"
            };
        }
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
        return {
            code: 500,
            message: "Erro de login"
        };
    }
}

export async function getUser(saram: string, cpf: string): Promise<User | ErrorTypes> {
    try {
        const user = await prisma.user.findFirst({
            where: {
              saram: saram,
              cpf: cpf
            },
          });
        if(!user){
            return {
                code: 404,
                message: "User not found"
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
                message: "User not found"
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
        await signOut({redirectTo:"/login"});
    } catch (error) {
        console.error("Erro ao tentar fazer logout:", error);
    }
}
