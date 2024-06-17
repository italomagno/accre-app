import NextAuth,{ DefaultSession, NextAuthConfig }  from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { googleSheetsDataSource } from "../lib/db/sheets/googleSheetsDataSource";
import { ErrorTypes } from "../types";
import { User } from "@prisma/client";

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
            CPF: {},
            saram: {},
          },
          //@ts-ignore de alguma manira nao ta idefentificando o problema
          authorize: async (credentials) => {
            try {
              const GoogleSheetsDataSource = new googleSheetsDataSource()
              const srmHash = credentials.saram as string
              const cpfHash = credentials.CPF as string
              const user =  GoogleSheetsDataSource.getUser(srmHash,cpfHash)
              if (!user || (user as unknown as ErrorTypes).code) {
                throw new Error("User not found.")
              }
              return user 
            } catch (error) {
              // Always return null if an error occurs
              return null
            }
          },
        }),
      ],
      /* callbacks: {
        async session({ session, token, user }) {
          const newUser = await getUserByEmail(session.user.email)
          // `session.user.address` is now a valid property, and will be type-checked
          // in places like `useSession().data.user` or `auth().user`
          return {
            ...session,
            user: newUser
          }
        },
      } */
 }
export const { handlers, auth ,signIn,signOut} = NextAuth(AuthOptions)