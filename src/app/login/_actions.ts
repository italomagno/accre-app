"use server"
import { getDataFromTab } from "@/src/lib/db";
import { signIn } from "@/src/app/auth";
import { FormValues, LoginSchema } from "@/src/types";



export async function getUserByCredentials(srmHash: string, cpfHash: string) {
    const [shifts,users] = await Promise.all([getDataFromTab("escala", 1000), getDataFromTab("users", 1000)])
    const user = users.find((user: any) => user.saram === srmHash && user.cpf === cpfHash)
    const shiftsOfUser = shifts.filter((shift: any) => shift.saram === srmHash)
    
    if (!user) {
        return null
    }
    const keysOfShiftsOfUser = Object.keys(shiftsOfUser[0]).filter((key) => key !== "saram" && key !== "name")
        const shiftsOfUserString = keysOfShiftsOfUser.map((key: any,day:number) => {
            const dayShift = shiftsOfUser[key]

            return `${day}:${dayShift}`  ;
        }).join(",")

        return { ...user, shifts: shiftsOfUserString }

    

}
export async function getUserByEmail(email:string) {
    const [shifts,users] = await Promise.all([getDataFromTab("escala", 1000), getDataFromTab("users", 1000)])
    const user = users.find((user: any) => user.email === email)
    const shiftsOfUser = shifts.filter((shift: any) => shift.saram === user.saram)
    if (!user) {
        return null
    }

    
   
    const keysOfShiftsOfUser = Object.keys(shiftsOfUser[0]).filter((key) => key !== "saram" && key !== "name")
        const shiftsOfUserString = keysOfShiftsOfUser.map((key: any,day:number) => {
            const dayShift = shiftsOfUser[0][key]

            return `${day+1}:${dayShift}`  ;
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