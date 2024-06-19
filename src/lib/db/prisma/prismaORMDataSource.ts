
import { DataSource } from "../interfaces/dataSource";
import { ErrorTypes } from "../../../types";
import  prisma  from "@/src/lib/db/prisma/prismaClient";
import { PrismaClient, User, Roster, Shift, WorkDay, Department } from "@prisma/client";



export class prismaORMDataSource implements DataSource {
    
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }
    createDepartment(department: { id: string; created_at: Date; name: string; spreadSheetId: string | null; }): Promise<{ id: string; created_at: Date; name: string; spreadSheetId: string | null; } | ErrorTypes> {
        throw new Error("Method not implemented.");
    }
    async createUser(user: User): Promise<ErrorTypes | User> {
        const newUser = await this.prisma.user.create({
            data: user
        });
        if (!newUser) {
            return {
                code: 500,
                message: "Erro de criação de usuário."
            }
        }
        return newUser;
    }
    async createUsers(users: User[]): Promise<User[] | ErrorTypes>{
        const usersCreated = await this.prisma.user.createMany({
            data: users
        });

        if(!usersCreated){
            return {
                code: 500,
                message: "Erro de criação de usuários."
            }
        }

        if(usersCreated.count !== users.length){
            return {
                code: 500,
                message: `Foram criados ${usersCreated.count} usuários de um total de ${users.length}`
            }
        }
        if(usersCreated.count === users.length){
            return users
        }

        return {
            code: 500,
            message: "Erro de criação de usuários."
        }



    }
    async getUser(saram:string,cpf:string,email?:string): Promise<User | ErrorTypes>{
        const user = await this.prisma.user.findFirst({
            where:{
                OR:[
                    {
                        saram:saram
                    },
                    {
                        cpf:cpf
                    },
                    {
                        email:email
                    }
                ]
            }
        });
        if(!user){
            return {
                code: 404,
                message: "User not found"
            }
        }
        return user;
    
    }
    async getUsers(search: string, offset: number,departmentId:string): Promise<User[] | ErrorTypes>{
        const users = await this.prisma.user.findMany(
            {
                where: {
                    departmentId: departmentId,
                    OR: [
                        {
                            name: {
                                contains: search
                            }
                        },
                        {
                            saram: {
                                contains: search
                            }
                        },
                        {
                            cpf: {
                                contains: search
                            }
                        },
                        {
                            email: {
                                contains: search
                            }
                        }
                    ]
                },
                skip: offset,
                take: 20
            }
        );
        if (!users) {
            return {
                code: 500,
                message: "Erro de busca de usuários."
            }
        }
        return users;
    
    }
    async updateUser(user: User): Promise<User | ErrorTypes>{

        const updatedUser = await this.prisma.user.update({
            where:{
                saram:user.saram
            },
            data:user
        });
        if(!updatedUser){
            return {
                code: 500,
                message: "Erro de atualização de usuário."
            }
        }
        return updatedUser;
    
    }
    async deleteUser(saram:string): Promise<User | ErrorTypes>{
        const user = await this.prisma.user.delete({
            where: {
                saram: saram
            }
        });
        if (!user) {
            return {
                code: 500,
                message: "Erro de remoção de usuário."
            }
        }
        return user;
    }
    
    //everything related to Rosters
    async createRoster(roster:Roster): Promise<Roster | ErrorTypes>{
        const newRoster = await this.prisma.roster.create({
            data: roster
        });
        if (!newRoster) {
            return {
                code: 500,
                message: "Erro de criação de escala."
            }
        }
        return newRoster;
    }
    //updateRoster(roster:Roster): Promise<Roster | ErrorTypes>;
    async getRoster(rosterId:string): Promise<Roster | ErrorTypes>{
        const roster = await this.prisma.roster.findFirst({
            where:{
                id:rosterId
            }
        });
        if (!roster) {
            return {
                code: 500,
                message: "Erro de busca de escala."
            }
        }
        return roster;
    }
    async deleteRoster(rosterId:string): Promise<Roster | ErrorTypes>{
        const roster = await this.prisma.roster.delete({
            where:{
                id:rosterId
            }
        });
        if (!roster) {
            return {
                code: 500,
                message: "Erro de remoção de escala."
            }
        }
        return roster;
    }


    //everything related to Shifts
    async getShift(shiftId:string): Promise<Shift | ErrorTypes>{
        const shift = await this.prisma.shift.findFirst({
            where:{
                id:shiftId
            }
        });
        if (!shift) {
            return {
                code: 500,
                message: "Erro de busca de turno."
            }
        }
        return shift;
    }
    async createShift(shift:Shift): Promise<Shift | ErrorTypes>{
        const newShift = await this.prisma.shift.create({
            data: shift
        });
        if (!newShift) {
            return {
                code: 500,
                message: "Erro de criação de turno."
            }
        }
        return newShift;
    }
    //createShifts(shifts:Shift[]): Promise<Shift[] | ErrorTypes>;
    async updateShift(shift:Shift): Promise<Shift | ErrorTypes>{
        const updatedShift = await this.prisma.shift.update({
            where:{
                id:shift.id
            },
            data:shift
        });
        if (!updatedShift) {
            return {
                code: 500,
                message: "Erro de atualização de turno."
            }
        }
        return updatedShift;
    }
    //updateShifts(shifts:Shift[]): Promise<Shift[] | ErrorTypes>;
    async deleteShift(shiftId:string): Promise<Shift | ErrorTypes>{
        const shift = await this.prisma.shift.delete({
            where:{
                id:shiftId
            }
        });
        if (!shift) {
            return {
                code: 500,
                message: "Erro de remoção de turno."
            }
        }
        return shift;
    }

    //everything related to workDays
    async createWorkDay(workDay:WorkDay): Promise<WorkDay | ErrorTypes>{
        const newWorkDay = await this.prisma.workDay.create({
            data: workDay
        });
        if (!newWorkDay) {
            return {
                code: 500,
                message: "Erro de criação de dia de trabalho."
            }
        }
        return newWorkDay;
    }

    async getWorkDays(userId:string,rosterId:string): Promise<WorkDay[] | ErrorTypes>{
        const workDays = await this.prisma.workDay.findMany({
            where:{
                AND:{
                    userId:userId,
                    rosterId:rosterId
                }
            }
        });
        if (!workDays) {
            return {
                code: 500,
                message: "Erro de busca de dias de trabalho."
            }
        }
        return workDays;
    }
    async updateWorkDay(workDay:WorkDay): Promise<WorkDay | ErrorTypes>
    {
        const updatedWorkDay = await this.prisma.workDay.update({
            where:{
                id:workDay.id
            },
            data:workDay
        });
        if (!updatedWorkDay) {
            return {
                code: 500,
                message: "Erro de atualização de dia de trabalho."
            }
        }
        return updatedWorkDay
    }
    
    async deleteWorkDay(workDayId:string): Promise<WorkDay | ErrorTypes>{
        const workDay = await this.prisma.workDay.delete({
            where:{
                id:workDayId
            }
        });
        if (!workDay) {
            return {
                code: 500,
                message: "Erro de remoção de dia de trabalho."
            }
        }
        return workDay;
    }

    //everything related to departments

    

    async getDepartment(departmentId:string): Promise<Department | ErrorTypes>{
        const department = await this.prisma.department.findFirst({
            where:{
                id:departmentId
            }
        });
        if (!department) {
            return {
                code: 500,
                message: "Erro de busca de departamento."
            }
        }
        return department;
    }

    async deleteDepartment(departmentId:string): Promise<Department | ErrorTypes>{
        const department = await this.prisma.department.delete({
            where:{
                id:departmentId
            }
        });
        if (!department) {
            return {
                code: 500,
                message: "Erro de remoção de departamento."
            }
        }
        return department;
    }



    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }

}