"use server"
import { getDataFromTab } from "@/src/lib/db";
import { signIn } from "@/src/app/auth";
import { FormValues, LoginSchema } from "@/src/types";



export async function getUserFromDb(srmHash: string, cpfHash: string) {
    const [shifts,users] = await Promise.all([getDataFromTab("escala", 1000), getDataFromTab("users", 1000)])
    const user = users.find((user: any) => user.saram === srmHash && user.cpf === cpfHash)
    const shiftsOfUser = shifts.filter((shift: any) => shift.saram === srmHash)
    
    if (!user) {
        return null
    }
   
        const shiftsOfUserString = shiftsOfUser.map((shift: any) => {
            const keys = Object.keys(shift)
            const obj: { [x: string]: string | number } = {};
            return keys.map((key) => {

                return `${obj[key]}:${shift[key] ?? ''}`  ;
            });
        
        }).join(",")

        return { ...user, shifts: shiftsOfUserString }

    

}

export async function signInOnServerActions(data: FormValues){
    const result = await  LoginSchema.parseAsync(data)
    if(result){
     const login = await signIn("credentials",data)
        return login
    }else{
        return null
    }

}