"use server"
import { getDataFromTab } from "@/src/lib/db"

export async function getShiftsFromUser(userEmail:string) {
    const [shifts,users] = await Promise.all([getDataFromTab("escala", 1000), getDataFromTab("users", 1000)])
    const user = users.find((user: any) => user.email === userEmail)
    const shiftsOfUser = shifts.filter((shift: any) => shift.saram === user.saram)
    if (!user) {
        return null
    }

    
   
    const keysOfShiftsOfUser = Object.keys(shiftsOfUser[0]).filter((key) => key !== "saram" && key !== "name")
        const shiftsOfUserString = keysOfShiftsOfUser.map((key: any,day:number) => {
            const dayShift = shiftsOfUser[0][key]

            return `${day+1}:${dayShift}`  ;
        }).join(",")


        return {shifts: shiftsOfUserString}
}

export async function saveProposal() {
    
}