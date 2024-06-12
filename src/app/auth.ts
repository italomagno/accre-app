import NextAuth,{ DefaultSession, NextAuthConfig }  from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod";
import { getUserByCredentials, getUserByEmail } from "./login/_actions";
import { cookies } from "next/headers";

declare module "next-auth" {
interface Session {
  user: {
    /** The user's postal address. */
    address: string
    /**
     * By default, TypeScript merges new interface properties and overwrites existing ones.
     * In this case, the default session user properties will be overwritten,
     * with the new ones defined above. To keep the default session user properties,
     * you need to add them back into the newly declared interface.
     */
  } & DefaultSession["user"]
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
          authorize: async (credentials) => {
            try {
              let user = null


          
              const srmHash = credentials.saram as string
              const cpfHash = credentials.CPF as string
              user = await getUserByCredentials(srmHash, cpfHash)
     
              if (!user) {
                throw new Error("User not found.")
              }
              return user
            } catch (error) {
              if (error instanceof ZodError) {
                // Return `null` to indicate that the credentials are invalid
                return null
              }
            }
          },
        }),
      ],
      callbacks: {
        async session({ session, token, user }) {
          const newUser = await getUserByEmail(session.user.email)
          // `session.user.address` is now a valid property, and will be type-checked
          // in places like `useSession().data.user` or `auth().user`
          return {
            ...session,
            user: newUser
          }
        },
      }
 }
export const { handlers, auth ,signIn,signOut} = NextAuth(AuthOptions)