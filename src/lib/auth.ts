import { compareCredential } from '@/src/lib/bcrypt';
import NextAuth,{ DefaultSession, NextAuthConfig }  from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { ErrorTypes } from "../types";
import { User } from "@prisma/client";
import { getUser } from "../app/login/_actions";

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
            CPF: {
              
            },
            saram: {
              
            },
          },
          authorize: async (credentials) => {
            try {
              const srmHash = credentials.saram as string
              const cpfHash = credentials.CPF as string
              const userFromDB =  await getUser(srmHash,cpfHash)
              if("code" in userFromDB){
                throw new Error("Usuário não encontrado.")
              }
             
              return {
                email: (userFromDB as User).email,
                id: (userFromDB as User).id,
                name: (userFromDB as User).name,
              } ?? null 
            } catch (error) {
              // Always return null if an error occurs
              return null
            }
          },
        }),
      ],
      callbacks: {
        async session({ session, token, user }) {
          // `session.user.address` is now a valid property, and will be type-checked
          // in places like `useSession().data.user` or `auth().user`
          return {
            ...session,
            user: {
              ...session.user,
            }
          }
        },
      }
 }
export const { handlers, auth ,signIn,signOut} = NextAuth(AuthOptions)


