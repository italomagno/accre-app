"use server"
import { isErrorTypes } from '@/src/types';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "./auth";
import { getUserByEmail } from "../app/login/_actions";
import prisma from './db/prisma/prismaClient';

export async function callGeminiToAnalyzeMyData(data:string){
try {
    const session = await auth();
    if(!session){
        return {
            code: 401,
            message: "Usuário não autenticado"
        }
    }
const user = await getUserByEmail(session.user.email);
const hasErrorOnUser =  isErrorTypes(user)
if(hasErrorOnUser){
    return {
        code: 404,
        message: "Usuário não encontrado"
    }
}
const isUserAdmin = user.role === "ADMIN";
if(!isUserAdmin){
    return {
        code: 401,
        message: "Usuário não autorizado"
    }
}
const shifts = await prisma.shift.findMany({
    where: {
        departmentId: user.departmentId
    },
    select:{
        name: true,
        quantity: true,
    }
});
if(!shifts){
    return {
        code: 404,
        message: "Turnos não encontrados"
    }
}
if(shifts.length === 0){
    return {
        code: 404,
        message: "Você precisa de pelo menos um turno registrado"
    }
}

const shiftHeaders = Object.keys(shifts[0])

const shiftValues = shifts.map((shift) => Object.values(shift))
const shiftDataInCscFormat = [shiftHeaders, ...shiftValues].map((row) => row.join(",")).join("\n")


console.log("vai tentar")


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const prompt = `
I wanto to fill a table with the shifts of the users in the roster
this is the table with the shifts:
1. shifts: ${shiftDataInCscFormat} where the first column is the name of the shift and the nexts are the quantity of the shift in a day

this is how the table containing the days of work: ${data}, where the first column is the users and the nexts are the days of the month,
where "-" means that the user is not working that day
but there are some rules like:
1. the name of the shift is separated by " | " when the user has more than one shift in the same day
2. the user each cannot have more than 2 shifts in the same day
3. the shifts that are abscenses are not counted
4. the user needs to rest at least 1 day after working 6 days in a row
5. the user cannot work after one shift that starts after 20:45 and ends 06:00
6. this day after this shift is counted like a day of work

and there are some rules to the shifts:
1.quantity on shifts is the quantity required of the shift in a day
2. the maximum number of shifts in a row is 18,
3. the user only can combine M|P2 the other shifts are always alone per day
3. de maximum of shifts that you can use per user is 5, and after 6 days you need to rest 1 day
4. day of rest is repesented by '-'
6. you can add more users to the table to every row has only 18 shifts


 in the roster but respecting the rules above and the rules of the shifts
 fill the table containing the days of work with the name of the shifts of the users in the roster


produce a textual representation of the completed roster in a CSV-like format (using commas to separate values). in the way that i can then copy and paste this data into a spreadsheet program (like Excel) and save it as a CSV file.


`

const result = await model.generateContent(prompt);
const response = result.response;
console.log("tentou")
const text = response.text();
console.log("resposta: ")
console.log(text);
return{
    code: 200,
    data: text
}
        
    } catch (error) {
        console.log("erroongemini", JSON.stringify(error, null, 2))
        return{
            code: 500,
            message: "Erro interno"
        }
    }

}