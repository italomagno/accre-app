import {  Roster, Shift, User, WorkDay } from '@prisma/client';

import { DataSource } from "../interfaces/dataSource";
import getGoogleSheetsClient from './googleSheetsClient';
import { ErrorTypes} from '@/src/types';


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

export  class googleSheetsDataSource implements DataSource {



 async  createUser(user: User): Promise< User| ErrorTypes> {
  const doc = await getGoogleSheetsClient();
  const usersSheet = doc.sheetsByTitle["Central de usuários"]
  if(!usersSheet){
    const usersCentralSheet = doc.addSheet({ title: `Central de usuários` })
    const emptyUser = {
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
  //@ts-ignore
  const userRowValues = Object.keys(user).map(key=>user[key])
  const addedRow = await usersSheet.addRow(userRowValues)
  if(!addedRow)
    return {
        code:404,
        message:"Não foi possível criar usuário"
      }
  return user
  
 }
 async  createUsers(users: User[]): Promise< User[]| ErrorTypes> {
  const doc = await getGoogleSheetsClient();
  const usersSheet = doc.sheetsByTitle["Central de usuários"]
  if(!usersSheet){
    const usersCentralSheet = doc.addSheet({ title: `Central de usuários` })
    const emptyUser:User = {
      id: '',
      saram: '',
      cpf: '',
  //@ts-ignore
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
  //@ts-ignore
  const userRowValues = users.map(user=>Object.keys(user).map(key=>user[key]))
  const addedRows = await usersSheet.addRows(userRowValues)
  if(!addedRows)
    return {
        code:404,
        message:"Não foi possível criar usuário"
      }

  return users
  
 }

  async getUser(saram: string,cpf:string,email?:string): Promise<User | ErrorTypes> {
    const doc = await getGoogleSheetsClient();
    const usersSheet = doc.sheetsByTitle["Central de usuários"]
    if(!usersSheet){
      const usersCentralSheet = doc.addSheet({ title: `Central de usuários` })
      const emptyUser:User = {
        id: '',
        saram: '',
        cpf: '',
  //@ts-ignore
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

      if(cpf){
        const user:User = users.find((user: any) => user.cpf === cpf);
        if (!user) {
          return { message: `Usuário com o email ${email} não encontrado.`,
                  code: 404
           };
        }
      return user;
    }
  
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
  //@ts-ignore
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
        return filteredUsers as User[]
      }
      return users as User[]
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

//@ts-ignore
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
//@ts-ignore

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

      const updatedUser:{[key:string]:any} = {}

      headers.forEach(key=>{
        
        updatedUser[key] = userFromUserSheet.get(key)
      })

      return updatedUser as User
      
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




  //everything related to Rosters
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
  async getRoster(rosterId: string): Promise<ErrorTypes | Roster> {
    const doc = await getGoogleSheetsClient();
    const rosterSheet = doc.sheetsByTitle["Central de Escalas"]
    if(!rosterSheet){
      doc.addSheet({ title: `Central de Escalas` })
    }
    const rosters = await getDataFromTab("Central de Escalas", 1000);
    const roster = rosters.find((roster: any) => roster.id === rosterId);
    if (!roster) {
      return { message: "Escala não encontrada",
              code: 404
       };
    }
    return roster;
  }

  async deleteRoster(rosterId:string): Promise<Roster | ErrorTypes>{
    const doc = await getGoogleSheetsClient();
    const rosterSheet = doc.sheetsByTitle["Central de Escalas"]
    if(!rosterSheet){
      doc.addSheet({ title: `Central de Escalas` })
    }
    const roster = (await rosterSheet.getRows()).find(roster=>roster.get("id") === rosterId)
    if(!roster){
      return { message: "Escala não encontrada",
      code: 404}
    }
    roster.delete()
    doc.sheetsByTitle[`Escala_${roster.get("month")}_${roster.get("year")}`].delete()

    const deletedRoster = {
      id: roster.get("id"),
      created_at: roster.get("created_at"),
      month: roster.get("month"),
      year: roster.get("year"),
      minWorkingHoursPerRoster: roster.get("minWorkingHoursPerRoster"),
      maxWorkingHoursPerRoster: roster.get("maxWorkingHoursPerRoster"),
      departmentId: roster.get("departmentId"),
      blockChanges: roster.get("blockChanges")
    }
    return deletedRoster
  }


  async createShift(shift:Shift): Promise<Shift | ErrorTypes>{
    const doc = await getGoogleSheetsClient();
    const shiftsSheet = doc.sheetsByTitle["Central de Turnos"]
    if(!shiftsSheet){
      const shiftsCentralSheet = doc.addSheet({ title: `Central de Turnos` })
//@ts-ignore
      const emptyShift:Shift = {
        id: '',
        name: '',
        start: new Date(),
        end: new Date(),
        quantity: 0,
        minQuantity: 0,
        rosterId: '',
        isAvailable: false,
        isAbscence: false,
        created_at: new Date(),
      }
      const headers = Object.keys(emptyShift);
      (await shiftsCentralSheet).setHeaderRow(headers)
    }
    //@ts-ignore
    const shiftRowValues = Object.keys(shift).map(key=>shift[key])
    const addedRow = await shiftsSheet.addRow(shiftRowValues)
    if(!addedRow)
      return {
          code:404,
          message:"Não foi possível criar turno"
        }
    return shift
  }

  async getShift(shiftId:string): Promise<Shift | ErrorTypes>{
    const doc = await getGoogleSheetsClient();
    const shiftsSheet = doc.sheetsByTitle["Central de Turnos"]
    if(!shiftsSheet){
      const shiftsCentralSheet = doc.addSheet({ title: `Central de Turnos` })
//@ts-ignore
      const emptyShift:Shift = {
        id: '',
        name: '',
        start: new Date(),
        end: new Date(),
        quantity: 0,
        minQuantity: 0,
        rosterId: '',
        isAvailable: false,
        isAbscence: false,
        created_at: new Date(),
      }
      const headers = Object.keys(emptyShift);
      (await shiftsCentralSheet).setHeaderRow(headers)
    }
    const shifts = await getDataFromTab("Central de Turnos", 1000);
    const shift = shifts.find((shift: any) => shift.id === shiftId);
    if (!shift) {
      return { message: "Turno não encontrado",
              code: 404
       };
    }
    return shift;
  }
    
  async updateShift(shift:Shift): Promise<Shift | ErrorTypes>{
    const doc = await getGoogleSheetsClient();
    const shiftsSheet = doc.sheetsByTitle["Central de Turnos"]
    if(!shiftsSheet){
      const shiftsCentralSheet = doc.addSheet({ title: `Central de Turnos` })
//@ts-ignore 
      const emptyShift:Shift = {
        id: '',
        name: '',
        start: new Date(),
        end: new Date(),
        quantity: 0,
        minQuantity: 0,
        rosterId: '',
        isAvailable: false,
        isAbscence: false,
        created_at: new Date(),
      }
      const headers = Object.keys(emptyShift);
      (await shiftsCentralSheet).setHeaderRow(headers)
    }
    const shiftFromShiftsSheet = (await shiftsSheet.getRows()).find(shiftFromSheets=>shiftFromSheets.get("id") === shift.id)
    if(!shiftFromShiftsSheet)
      {
        return {
          code:404,
          message:"Turno não encontrado"
        }
      }
    shiftFromShiftsSheet.assign(shift)
//@ts-ignore
    const emptyShift:Shift = {
      id: '',
      name: '',
      start: new Date(),
      end: new Date(),
      quantity: 0,
      minQuantity: 0,
      rosterId: '',
      isAvailable: false,
      isAbscence: false,
      created_at: new Date(),
    }
    const headers = Object.keys(emptyShift);

    const updatedShift:{[key:string]:any}  = {}

    headers.forEach(key=>{
      updatedShift[key] = shiftFromShiftsSheet.get(key)
    })

    return updatedShift as Shift
  }

  async deleteShift(shiftId: string): Promise<Shift | ErrorTypes>{
    const doc = await getGoogleSheetsClient();
    const shiftsSheet = doc.sheetsByTitle["Central de Turnos"]
    if(!shiftsSheet){
      const shiftsCentralSheet = doc.addSheet({ title: `Central de Turnos` })
//@ts-ignore
      const emptyShift:Shift = {
        id: '',
        name: '',
        start: new Date(),
        end: new Date(),
        quantity: 0,
        minQuantity: 0,
        rosterId: '',
        isAvailable: false,
        isAbscence: false,
        created_at: new Date(),
      }
      const headers = Object.keys(emptyShift);
      (await shiftsCentralSheet).setHeaderRow(headers)
    }
    const shift = (await shiftsSheet.getRows()).find(shift=>shift.get("id") === shiftId)
    if(!shift){
      return { message: "Turno não encontrado",
      code: 404}
    }
    shift.delete()
    const deletedShift = {
      id: shift.get("id"),
      name: shift.get("name"),
      start: shift.get("start"),
      end: shift.get("end"),
      quantity: shift.get("quantity"),
      minQuantity: shift.get("minQuantity"),
      rosterId: shift.get("rosterId"),
      isAvailable: shift.get("isAvailable"),
      isAbscence: shift.get("isAbscence"),
      created_at: shift.get("created_at"),
    }
    return deletedShift as Shift
  }

  //everything related to workDays

  async updateWorkDay(workDay: { id: string; day: Date; userId: string; rosterId: string; shiftId: string; }): Promise<{ id: string; day: Date; userId: string; rosterId: string; shiftId: string; } | ErrorTypes> {
    const doc = await getGoogleSheetsClient();
    const workDaysSheet = doc.sheetsByTitle["Central de Dias trabalhados"]
    if(!workDaysSheet){
      const workDaysCentralSheet = doc.addSheet({ title: `Central de Dias trabalhados` })
    }
    const workDayFromWorkDaysSheet = (await workDaysSheet.getRows()).find(workDayFromSheets=>workDayFromSheets.get("day") === workDay.day && workDayFromSheets.get("userId") === workDay.userId && workDayFromSheets.get("rosterId") === workDay.rosterId)
    if(!workDayFromWorkDaysSheet)
      {
        return {
          code:404,
          message:"Dia de trabalho não encontrado"
        }
      }
    workDayFromWorkDaysSheet.assign(workDay)
    const updatedWorkDay = {
      id: workDayFromWorkDaysSheet.get("id"),
      day: workDayFromWorkDaysSheet.get("day"),
      userId: workDayFromWorkDaysSheet.get("userId"),
      rosterId: workDayFromWorkDaysSheet.get("rosterId"),
      shiftId: workDayFromWorkDaysSheet.get("shiftId")
    }
    return updatedWorkDay
  }
  async createWorkDay(workDay:WorkDay): Promise<WorkDay | ErrorTypes>{
    const doc = await getGoogleSheetsClient();
    const workDaysSheet = doc.sheetsByTitle["Central de Dias trabalhados"]
    if(!workDaysSheet){
      const workDaysCentralSheet = doc.addSheet({ title: `Central de Dias trabalhados` })
    }
    const workDayFromWorkDaysSheet = (await workDaysSheet.getRows()).find(workDayFromSheets=>workDayFromSheets.get("day") === workDay.day && workDayFromSheets.get("userId") === workDay.userId && workDayFromSheets.get("rosterId") === workDay.rosterId)
    if(workDayFromWorkDaysSheet && workDayFromWorkDaysSheet.get("shiftId") === workDay.shiftId)
      {
        return {
          code:404,
          message:"Dia de trabalho já existente"
        }
      }

      //@ts-ignore
  const workDayRowValues = Object.keys(workDay).map(key=>workDay[key])
  await workDaysSheet.addRow(workDayRowValues)

  return workDay
  }

  async deleteWorkDay(workDayId: string): Promise<WorkDay | ErrorTypes>{
    const doc = await getGoogleSheetsClient();
    const workDaysSheet = doc.sheetsByTitle["Central de Dias trabalhados"]
    if(!workDaysSheet){
      const workDaysCentralSheet = doc.addSheet({ title: `Central de Dias trabalhados` })
    }
    const workDay = (await workDaysSheet.getRows()).find(workDay=>workDay.get("id") === workDayId)
    if(!workDay){
      return { message: "Dia de trabalho não encontrado",
      code: 404}
    }
    workDay.delete()
    const deletedWorkDay = {
      id: workDay.get("id"),
      day: workDay.get("day"),
      userId: workDay.get("userId"),
      rosterId: workDay.get("rosterId"),
      shiftId: workDay.get("shiftId")
    }
    return deletedWorkDay as WorkDay
  }

  async getWorkDays(userId:string,rosterId:string): Promise<WorkDay[] | ErrorTypes>{
    const doc = await getGoogleSheetsClient();
    const workDaysSheet = doc.sheetsByTitle["Central de Dias trabalhados"]
    if(!workDaysSheet){
      const workDaysCentralSheet = doc.addSheet({ title: `Central de Dias trabalhados` })
    }
    const workDays = await getDataFromTab("Central de Dias trabalhados", 1000);
    const workDay = workDays.filter((workDay: any) => workDay.userId === userId && workDay.rosterId === rosterId);
    if (!workDay) {
      return { message: "Dia de trabalho não encontrado",
              code: 404
       };
    }
    return workDay;
  }


}







