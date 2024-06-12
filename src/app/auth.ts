import NextAuth,{ NextAuthConfig }  from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod";
import { getUserFromDb } from "./login/_actions";

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
              user = await getUserFromDb(srmHash, cpfHash)
     
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
 }
export const { handlers, auth ,signIn,signOut} = NextAuth(AuthOptions)