"use server"
import { signIn, signOut } from "@/src/app/auth";
import { FormValues, LoginSchema } from "@/src/types";




export async function signInOnServerActions(data: FormValues){
    const result = await  LoginSchema.parseAsync(data)
    if(result){
     const login = await signIn("credentials",data)
        return login
    }else{
        return null
    }

}

export async function handleLogOut(){
          await signOut()
}