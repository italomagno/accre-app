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

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});

const prompt = `
could you help-me to generate a code to fill a table with the days of work of the users in the roster?
i'm using typescript with nextjs to do it, so generate a code in typescript
this is how the table containing the days of work: ${data}, where the first column is the users and the others columns is about the days of the month are the days of the month,
when the cell of the table is "-" means that the user is not working that day
i want to produce a code to fill the table with the shifts of the users in this roster
but there are some rules like:
1. the name of the shift is separated by "|" when in this day the user has more than one shift.
2. only is possible to have two shifts in the day if they are separated at least eight hours of rest between them.
3. when the shift is marked with isAbscense === true means that shifts is not a work shift.
4. shift is every shift that is marked with isAbscense === false.
5. a shift for a user is when the cell of the table is not "-" and has the name of the shift in your respective row (user row) and column (day column)
5. the user cannot work after one shift that starts after 20:45 and ends 06:00, but this day is counted like an day of work
6. the user cannot have more than 6 shifts in a row, but the user can have 6 shifts in a row if the user has two days of rest after the 6 shifts
7. "in a row" means one shift after the other without a day of rest between them
8. when a shift with is abscense in the day, the shift cannot be in the same day of the user

the shifts data is: ${shiftDataInCscFormat} and the model of shift is the below:
    id             String   @id @default(auto()) @map("_id") @db.ObjectId
  created_at     DateTime @default(now())
  name           String  
  workDay        WorkDay[] @relation(fields: [workDayId], references: [id])
  workDayId      String[] @db.ObjectId
  start          DateTime
  end            DateTime
  quantity       Int @default(0)
  minQuantity    Int  @default(0)
  quantityInWeekEnd Int @default(0)
  minQuantityInWeekEnd Int @default(0)
  maxQuantity    Int  @default(0)
  rosters        Roster[] @relation(fields: [rostersId], references: [id])
  rostersId      String[] @db.ObjectId
  department     Department @relation(fields: [departmentId], references: [id])
  departmentId   String @db.ObjectId
  isOnlyToSup    Boolean @default(false)
  isAvailable   Boolean @default(false)
  isAbscence    Boolean @default(false)

and there are some rules to the shifts:
1. the key called "quantity" is how many shifts with this name need to have in a day column (no matters which user is working)
2. the maximum number of shifts in a row is 18.
3. the start and end of the shift is  a date where the time is when the shift starts and ends and this is used to calculates if i can put other shift in the same day, or has two days of rest after 6 days of work in a row
3. minquantity is the minimum number of shifts with this name that a user can have in your row in the table
4. quantity in the weekend is similar to quantity, but when is set with a number more than 0 means that needs at least this number of shifts row when the column is the weekend
6. you can add more users to the table to every row has only 18 shifts
7. isOnlytoSup when is setted to true means that this shift is only to the supervisor
8. isAvailable when is setted to false means that this shift is available to each user in the roster. supervisor is included.
9. is available means that the user can use this shift in the roster


 in the roster but respecting the rules above and the rules of the shifts
 fill the table containing the days of work with the name of the shifts of the users in the roster


produce a textual representation of the completed roster in a CSV-like format (using commas to separate values). in the way that i can then copy and paste this data into a spreadsheet program (like Excel) and save it as a CSV file.

below is my piece of code:



`

const result = await model.generateContent(prompt);
const response = result.response;
const text = response.text();
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