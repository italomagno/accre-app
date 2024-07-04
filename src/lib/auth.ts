import NextAuth,{ DefaultSession, NextAuthConfig }  from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { User } from "@prisma/client";
import { getUser } from "../app/login/_actions";
import { redirect } from "next/navigation";

declare module "next-auth" {
interface Session {
  user: User & DefaultSession["user"]
}
}


export const AuthOptions:NextAuthConfig = { 
    providers: [
        Credentials({
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          credentials: {
            email: {
              
            },
            password: {
              
            },
          },
          authorize: async (credentials) => {
            try {
              const email = credentials.email as string
              const password = credentials.password as string
              const userFromDB = await getUser(email, password)
              if("code" in userFromDB){
                throw new Error("Usuário não encontrado.")
              }
              return userFromDB
              
            } catch (error) {
              // Always return null if an error occurs
              return null
            }
          },
        }),
      ],
     
 }
export const { handlers, auth ,signIn,signOut} = NextAuth(AuthOptions)


