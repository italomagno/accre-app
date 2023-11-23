import { decrypt } from "@/utils/crypto"
import { randomBytes, randomUUID } from "crypto"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
export const authOptions:AuthOptions = {
  session: {
  // Choose how you want to save the user session.
  // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
  // If you use an `adapter` however, we default it to `"database"` instead.
  // You can still force a JWT session by explicitly defining `"jwt"`.
  // When using `"database"`, the session cookie will only contain a `sessionToken` value,
  // which is used to look up the session in the database.
  strategy: "jwt",

  // Seconds - How long until an idle session expires and is no longer valid.
  maxAge: 30 * 24 * 60 * 60, // 30 days

  // Seconds - Throttle how frequently to write to database to extend a session.
  // Use it to limit write operations. Set to 0 to always update the database.
  // Note: This option is ignored if using JSON Web Tokens
  updateAge: 24 * 60 * 60, // 24 hours
  
  // The session token is usually either a random UUID or string, however if you
  // need a more customized session token string, you can define your own generate function.
  generateSessionToken: () => {
    return randomUUID?.() ?? randomBytes(32).toString("hex")
  }
},
  // Configure one or more authentication providers
 
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        cpf: { label: "CPF", type: "text", placeholder: "jsmith" },
        saram: { label: "saram", type: "password" }
      },
      async authorize(credentials, req) {

        if(credentials === undefined) return null

          credentials.cpf = credentials.cpf.replace(/\D/g, "");
          credentials.saram = credentials.saram.replace(/\D/g, "");


        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/googlesheets`, {
          method: 'GET',
        })
        const data = await res.json()

        if (!data || !data["dataFromSheets"]) {
          return null; // Ou trate o erro conforme necessário
        }

        const user = data["dataFromSheets"].find((mil: any) => (
          decrypt(mil.cpf) === credentials?.cpf && decrypt(mil.saram) === credentials.saram
        ));

        if (!user) {
          return null;
        }

        user.cpf = decrypt(user.cpf);
        user.saram = decrypt(user.saram);

        if (user) {
          return {
            id: user.saram,
            name: user.name // Certifique-se de que 'name' existe no objeto 'user'
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
},

}
export default NextAuth(authOptions)