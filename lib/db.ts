import 'server-only';
import { google } from "googleapis";
import { GoogleSpreadsheet } from "google-spreadsheet";



export async function getDataFromTab(tabName: string, limit: number = 10) {
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

  const leadsSheets = doc.sheetsByTitle
  const leadsSheet = Object.keys(leadsSheets).includes(tabName) ? leadsSheets[tabName] : null
  if (!leadsSheet) {
    return []
  }

  const rows = (await leadsSheet.getRows({ limit: limit })) // Add limit parameter to getRows() method
  const headers = leadsSheet.headerValues;
  //@ts-ignore
  const dataFromSheets = rows.map(row => {
    const obj: any = {}
    //@ts-ignore
    headers.forEach((header, i) => {
      obj[header] = row["_rawData"][i]
    })

    return obj
  })

  return dataFromSheets
}


export async function getUsers(search: string, offset: number) {
  const users = await getDataFromTab("users", offset);
  if (search) {
    const filteredUsers = users.filter((user: any) => {
      return Object.keys(user).some((key) =>
        user[key].toLowerCase().includes(search.toLowerCase())
      );
    });
    const newOffset = null;
    return { users: filteredUsers, newOffset };
  }
  const newOffset = users.length >= offset + 20 ? offset + 20 : null;
  return { users, newOffset };
}
export async function getShifts(search: string, offset: number) {
  const shiftsOld = await getDataFromTab("escala-6/2024", offset);
  const shifts = shiftsOld.map((shift: any) => {if(!shift){return "-"}else{return shift}});

  if (search) {
    const filteredShifts = shifts.filter((shift: any) => {
      return Object.keys(shift).some((key) =>
        shift[key] && shift[key].toLowerCase().includes(search.toLowerCase())
      );
    });
    const newOffset = null;
    return { shifts: filteredShifts, newOffset };
  }
  const newOffset = shifts.length >= offset + 20 ? offset + 20 : null;
  return { shifts, newOffset };
}





/* 

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { eq, ilike } from 'drizzle-orm';

export const db = ""

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }),
  username: varchar('username', { length: 50 }),
  email: varchar('email', { length: 50 })
});

export type SelectUser = typeof users.$inferSelect;

export async function getUsers(
  search: string,
  offset: number
): Promise<{
  users: SelectUser[];
  newOffset: number | null;
}> {
  // Always search the full table, not per page
  if (search) {

    return {
      user,
    };
  }

  if (offset === null) {
    return { users: [], newOffset: null };
  }

  const moreUsers = await db.select().from(users).limit(20).offset(offset);
  const newOffset = moreUsers.length >= 20 ? offset + 20 : null;
  return { users: moreUsers, newOffset };
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}
 */