import { $Enums } from '@prisma/client';
'use server'

import { auth } from '@/src/app/auth';
import { DataSource } from "../interfaces/dataSource";
import getGoogleSheetsClient from './googleSheetsClient';
import { ErrorTypes, Roster, Shift, User } from '@/src/types';


async function getDataFromTab(tabName: string, limit: number = 10) {
  const doc = await getGoogleSheetsClient();
  const leadsSheets = doc.sheetsByTitle
  const leadsSheetKey= Object.keys(leadsSheets).find(key=>key.toLowerCase().includes(tabName.toLowerCase()))
  if (!leadsSheetKey) {
    return []
  }
  
  const leadsSheet = leadsSheets[leadsSheetKey]

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


export class googleSheetsDataSource implements DataSource {


 //everything related to user

 async  createUser(user: User): Promise< User| ErrorTypes> {
  const doc = await getGoogleSheetsClient();
  const usersSheet = doc.sheetsByTitle["Central de usuários"]
  if(!usersSheet){
    const usersCentralSheet = doc.addSheet({ title: `Central de usuários` })
    const emptyUser:User = {
      id: '',
      saram: '',
      cpf: '',
      created_at: undefined,
      name: '',
      email: '',
      block_changes: false,
      isOffice: false,
      function: 'EST',
      role: 'ADMIN',
      rosterId: '',
      departmentId: ''
    }
    const headers = Object.keys(emptyUser);
    (await usersCentralSheet).setHeaderRow(headers)
  }
  const userRowValues = Object.keys(user).map(key=>user[key])
  const addedRow = await usersSheet.addRow(userRowValues)
  if(!addedRow)
    return {
        code:404,
        message:"Não foi possível criar usuário"
      }
  return user
  
 }
 async  createUsers(users: User[]): Promise< User| ErrorTypes> {
  const doc = await getGoogleSheetsClient();
  const usersSheet = doc.sheetsByTitle["Central de usuários"]
  if(!usersSheet){
    const usersCentralSheet = doc.addSheet({ title: `Central de usuários` })
    const emptyUser:User = {
      id: '',
      saram: '',
      cpf: '',
      created_at: undefined,
      name: '',
      email: '',
      block_changes: false,
      isOffice: false,
      function: 'EST',
      role: 'ADMIN',
      rosterId: '',
      departmentId: ''
    }
    const headers = Object.keys(emptyUser);
    (await usersCentralSheet).setHeaderRow(headers)
  }
  const userRowValues = users.map(user=>Object.keys(user).map(key=>user[key]))
  const addedRows = await usersSheet.addRows(userRowValues)
  if(!addedRows)
    return {
        code:404,
        message:"Não foi possível criar usuário"
      }

  return users
  
 }

  async getuser(saram?: string,email?:string): Promise<User | ErrorTypes> {
    const doc = await getGoogleSheetsClient();
    const usersSheet = doc.sheetsByTitle["Central de usuários"]
    if(!usersSheet){
      const usersCentralSheet = doc.addSheet({ title: `Central de usuários` })
      const emptyUser:User = {
        id: '',
        saram: '',
        cpf: '',
        created_at: undefined,
        name: '',
        email: '',
        block_changes: false,
        isOffice: false,
        function: 'EST',
        role: 'ADMIN',
        rosterId: '',
        departmentId: ''
      }
      const headers = Object.keys(emptyUser);
      (await usersCentralSheet).setHeaderRow(headers)
    }
    
    const users = await getDataFromTab("Central de usuários", 1000);
    if(saram){
      const user:User = users.find((user: any) => user.saram === saram);
      if (!user) {
        return { message: `Usuário com o saram ${saram} não encontrado.`,
                code: 404
         };
      }
      return user;    
    }

    if(email){
      const user:User = users.find((user: any) => user.email === email);
      if (!user) {
        return { message: `Usuário com o email ${email} não encontrado.`,
                code: 404
         };
      }
      return user;
    }
    return {
      message: "Erro ao buscar usuário",
      code : 404
    }
  
  }
  async getUsers(search: string, offset: number): Promise<User[] | ErrorTypes> {
    const doc = await getGoogleSheetsClient();
    const usersSheet = doc.sheetsByTitle["Central de usuários"]
    if(!usersSheet){
      const usersCentralSheet = doc.addSheet({ title: `Central de usuários` })
      const emptyUser:User = {
        id: '',
        saram: '',
        cpf: '',
        created_at: undefined,
        name: '',
        email: '',
        block_changes: false,
        isOffice: false,
        function: 'EST',
        role: 'ADMIN',
        rosterId: '',
        departmentId: ''
      }
      const headers = Object.keys(emptyUser);
      (await usersCentralSheet).setHeaderRow(headers)
    }
      const users = await getDataFromTab("Central de usuários", offset);
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


  async  updateUser(user: User): Promise< User| ErrorTypes> {
      const doc = await getGoogleSheetsClient();
      const usersSheet = doc.sheetsByTitle["Central de usuários"]
      if(!usersSheet){
        const usersCentralSheet = doc.addSheet({ title: `Central de usuários` })
        const emptyUser:User = {
          id: '',
          saram: '',
          cpf: '',
          created_at: undefined,
          name: '',
          email: '',
          block_changes: false,
          isOffice: false,
          function: 'EST',
          role: 'ADMIN',
          rosterId: '',
          departmentId: ''
        }
        const headers = Object.keys(emptyUser);
        (await usersCentralSheet).setHeaderRow(headers)
      }
      const userFromUserSheet = (await usersSheet.getRows()).find(userFromSheets=>userFromSheets.get("id") === user.id)
      if(!userFromUserSheet)
        {
          return {
            code:404,
            message:"Usuário não encontrado"
          }
        }
       /*  const userValuesToUpdate = Object.keys(user).map(key=>({
          key,
          val:user[key]
        })) */
       userFromUserSheet.assign(user)
       const emptyUser:User = {
        id: '',
        saram: '',
        cpf: '',
        created_at: undefined,
        name: '',
        email: '',
        block_changes: false,
        isOffice: false,
        function: 'EST',
        role: 'ADMIN',
        rosterId: '',
        departmentId: ''
      }
      const headers = Object.keys(emptyUser);

      const updatedUser:User  = {}

      headers.forEach(key=>{
        updatedUser[key] = userFromUserSheet.get(key)
      })
      
      return updatedUser
      
     }

  async deleteUser(saram: string): Promise<User | ErrorTypes> {
    const users = await getDataFromTab("users", 1000);
    const user = users.find((user: any) => user.saram === saram);
    if (!user) {
      return { message: "User not found",
              code: 404
       };
    }
    await user.delete();
    return user;
  }




  

  async createRoster(roster:Roster): Promise<ErrorTypes | Roster> {
  const doc = await getGoogleSheetsClient();

  const createdRoster = await doc.addSheet({ title: `Escala_${roster.month}_${roster.year}` })

  if(!createdRoster){
    return { message: "Erro ao criar uma nova escala",
    code: 500
  }}
  const newRoster:Roster = {
    id: createdRoster.title,
    created_at: new Date(),
    month:roster.month,
    year: roster.year,
    minWorkingHoursPerRoster: roster.minWorkingHoursPerRoster ?? 40,
    maxWorkingHoursPerRoster: roster.maxWorkingHoursPerRoster ?? 160,
    departmentId: doc.spreadsheetId,
    blockChanges: false
  }
  const RosterHeaders = Object.keys(newRoster)
  //@ts-ignore
  const RosterValues = RosterHeaders.map((header:string) => newRoster[header]);
  createdRoster.setHeaderRow(["name","saram","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"])

  const alredyHasRosterSheet = doc.sheetsByTitle["Central de Escalas"]
  if(!alredyHasRosterSheet){
    const rosterSheet = await doc.addSheet({ title: `Central de Escalas` })
    rosterSheet.setHeaderRow(RosterHeaders)
    rosterSheet.addRow(RosterValues)
  }
  
  return newRoster;
  }
 
   getUserShiftsByRoster(saram: string,month:string,year:number): Promise<ErrorTypes | WorkDay[]> {
    /* const users = await getDataFromTab("users", 1000);
    const user:User = users.find((user: any) => user.saram === saram);
    if (!user) {
      return { message: "User not found",
              code: 404
       };
    }
    
    const shifts = await getDataFromTab(`Escala_${month}_${year}`, 1000);
    if(!shifts){
    return {
      message: "Turnos Não encontrados",
      code: 404
    
    }
    }
    const userShifts = shifts.filter((shift: any) => shift.saram === saram)
    if(!userShifts){
      return {
        message: `Turnos do saram: ${saram} não encontrados.`,
        code: 404
      
      }
    }

    const  shiftsData:Shift[] = (await getDataFromTab("shiftsControl", 1000)).map((shift: any) => {
      const newShift:Shift = {
        name: shift.name,
        start: shift.start ?? new Date(),
        end: shift.end ?? new Date(),
        quantity: shift.quantity ?? 0,
        minQuantity: shift.minQuantity ?? 0,
        userId: shift.userId ?? user.saram,
        rosterId: shift.rosterId,
        departmentId: shift.departmentId,
        isAvailable: shift.isAvailable,
        isAbscence: shift.isAbscence,
        id: shift.id ?? shift.id.toString(),
        created_at: shift.created_at ?? new Date(),
        day: shift.day ?? ''
      }
      return newShift;

    }


    const newShifts = userShifts.filter((shift: any) => shift !== isNaN(parseFloat(shift))).map((shift: any) => {
          const newShift
    })

    return userShifts; */
    throw new Error('Method not implemented.');
  }

  getRosterByMonthAndDepartment(month: string, year: number, departmentId: string): Promise<ErrorTypes | { id: string; created_at: Date; month: $Enums.Months; year: number; minWorkingHoursPerRoster: number | null; maxWorkingHoursPerRoster: number | null; departmentId: string; blockChanges: boolean; }> {
    throw new Error('Method not implemented.');
  }


  

  async getShiftsControlers() {
    const shiftsControllers = await getDataFromTab("shiftsControl", 1000);
    return shiftsControllers;
  }
  async getShiftsMil(search: string, offset: number) {
    const session = await auth();
    if(!session) return {shifts:[],newOffset:null}
    const shiftsOld = await getDataFromTab("escala", offset);
    const shifts = shiftsOld.map((shift: any) => {if(!shift){return "-"}else{return shift}});
    if (search) {
      const filteredShifts = shifts.filter((shift: any) => {
        return Object.keys(shift).some((key) =>
          shift[key] && shift[key].toLowerCase().includes(search.toLowerCase())
        );
      });
      const newOffset = shifts.length <= offset + 10  ? offset + 10  : shifts.length -1
      return { shifts: filteredShifts, newOffset };
    }
    const newOffset = shifts.length >= offset + 10 ? offset + 10 : offset + 10
    return { shifts, newOffset };
  }
}


export async function getShifts() {

  const shiftsControllers = await getDataFromTab("shiftsControl", 1000);
  return shiftsControllers;
}
  



export async function getShiftsMil(search: string, offset: number) {
  const session = await auth();
  const shiftsOld = await getDataFromTab("escala", offset);
  const shifts = shiftsOld.map((shift: any) => {if(!shift){return "-"}else{return shift}});
  if (search) {
    const filteredShifts = shifts.filter((shift: any) => {
      return Object.keys(shift).some((key) =>
        shift[key] && shift[key].toLowerCase().includes(search.toLowerCase())
      );
    });
    const newOffset = shifts.length <= offset + 10  ? offset + 10  : shifts.length -1
    return { shifts: filteredShifts, newOffset };
  }
  const newOffset = shifts.length >= offset + 10 ? offset + 10 : offset + 10
  return { shifts, newOffset };
}







