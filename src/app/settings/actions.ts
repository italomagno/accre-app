'use server'

import { auth } from "@/src/lib/auth"
import prisma from "@/src/lib/db/prisma/prismaClient"
import { $Enums } from "@prisma/client"



export async function getUserRole() {
    const session = await auth()
    const user = await prisma.user.findUnique({
        where:{
            email:session?.user.email
        }
    })
    return user?.role as $Enums.Role
}