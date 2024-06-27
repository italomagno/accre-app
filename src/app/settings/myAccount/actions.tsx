"use server"

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"


export async function getUserProfile(){
    const session = await auth()
    if(!session){
        return null
    }
    const email = session.user.email
    const user = prisma.user.findUnique({
        where:{
            email
        }
    })
    return user

}