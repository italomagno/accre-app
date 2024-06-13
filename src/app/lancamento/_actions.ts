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

import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { google } from "googleapis"

// Assuming you have a global 'doc' object representing your Google Spreadsheet
// (e.g., initialized with your spreadsheet ID and credentials)


interface Error {
    error: string;
    code: number;
}

export const updateUserShifts = async (
  saram: string,
  shifts: string
): Promise<GoogleSpreadsheetRow | Error> => {
    if (!saram) {
        return {
            error:"Saram não informado.",
            code:400
        }
    }
    if (!shifts) {
        return {
            error:"Turnos não informados.",
            code:400
        }
    }
    const daysOfMonth = []
    for (let i = 1; i <= 31; i++) {
        daysOfMonth.push({ day: i, shift: "" })
    }
    const shiftsSplitted = shifts.split(",").map((shift) => {
        const [day, shiftName] = shift.split(":");
        return { day: parseInt(day), shift: shiftName };
    });

    const shiftsProposal = daysOfMonth.map((day) => {
        const shift = shiftsSplitted.find((shift) => shift.day === day.day)?.shift;
        return shift || "";
    });

  try {
    const client_email = (process.env.NEXT_PUBLIC_CLIENT_EMAIL as string).replace(/\\n/g, '\n')
  const private_key = (process.env.NEXT_PUBLIC_PRIVATE_KEY as string).replace(/\\n/g, '\n')
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: client_email,
      private_key: private_key,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  
  const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_SPREADSHEET_ID as string, auth)

    await doc.loadInfo();
    const sheetShiftsMonth = Object.keys(doc.sheetsByTitle).find((title) =>
      title.includes('escala')
    );
    if (!sheetShiftsMonth) {
      console.error("Sheet with 'escala' in the title not found.");
      return {
        error:"Não foi encontrado a aba de escala no arquivo de planilha.",
        code:404
      }; 
    }

    const leadsSheet = doc.sheetsByTitle[sheetShiftsMonth];

    // Find the row matching the 'saram'
    const rows = await leadsSheet.getRows({ offset: 0 });
    const rowDataIndex = rows.findIndex(
      (r) => r.get('saram')?.replace(/\D/g, '') === saram
    );
    const rowData = rows[rowDataIndex];

    if (!rowData) {
      return {
        error:`Não foi encontrado a linha com o saram ${saram}.`,
        code:404
      } 
    }

    // Update the row data
    const saramFromRow = rowData.get('saram');
    const nameFromRow = rowData.get('name');
    const newRawData = [nameFromRow, saramFromRow, ...shiftsProposal];

    rowData['_rawData'] = newRawData;
    await rowData.save();

    return rowData; 
  } catch (error) {
    return {
        error:"Ocorreu um erro ao atualizar os turnos.",
        code:500
    }
  }
};


