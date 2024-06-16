
import { Roster, Shift,Department ,User} from "@prisma/client";
import {  ErrorTypes } from "../../../types";

// src/interfaces/DataSource.ts
export interface DataSource {
   //everything related to users
    createUser(user: User): Promise<User | ErrorTypes>;
    createUsers(users: User[]): Promise<User[] | ErrorTypes>;
    getUser(saram:string): Promise<User | ErrorTypes>;
    getUsers(search: string, offset: number,departmentId:string): Promise<User[] | ErrorTypes>;
    
    updateUser(user: User): Promise<User | ErrorTypes>;

    deleteUser(saram:string): Promise<User | ErrorTypes>;
    
    //everything related to Rosters
    createRoster(roster:Roster): Promise<Roster | ErrorTypes>;
    updateRoster(roster:Roster): Promise<Roster | ErrorTypes>;
    getRoster(rosterId:string): Promise<Roster | ErrorTypes>;
    deleteRoster(rosterId:string): Promise<Roster | ErrorTypes>;


    //everything related to Shifts
    createShift(shift:Shift): Promise<Shift | ErrorTypes>;
    createShifts(shifts:Shift[]): Promise<Shift[] | ErrorTypes>;
    updateShift(shift:Shift): Promise<Shift | ErrorTypes>;
    updateShifts(shifts:Shift[]): Promise<Shift[] | ErrorTypes>;
    deleteShift(shiftId:string): Promise<Shift | ErrorTypes>;











    //getUserShiftsByRoster(saram:string,month:string,year:number): Promise<Shift[]| ErrorTypes>;
    //getRosterByMonthAndDepartment(month:string,year:number,departmentId:string): Promise<Roster | ErrorTypes>;
}