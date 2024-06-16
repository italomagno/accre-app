
import { DataSource } from "../interfaces/dataSource";

import { ErrorTypes, Roster, Shift, User } from "../../../types";
import  prisma  from "@/src/lib/db/prisma/prismaClient";
import { PrismaClient,$Enums } from "@prisma/client";



export class prismaORMDataSource implements DataSource {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }
    async getUsers(search: string, offset: number,departmentId:string): Promise<ErrorTypes | User[]> {
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
    async getuserBySaram(saram: string): Promise<User | ErrorTypes> {
        const user = await this.prisma.user.findUnique({
            where: {
                saram: saram
            }
        });
        if (!user) {
            return {
                code: 404,
                message: "User not found"
            }
        }
        return user
    }
    async createRoster(roster:Roster):Promise<ErrorTypes | Roster> {
        const newRoster = await this.prisma.roster.create({
            data: roster
    });
    if(!newRoster){
        return {
            code: 500,
            message: "Erro de criação de escala."
        }
    }
    return newRoster;
    }
    async deleteUser(saram: string): Promise<User | ErrorTypes> {
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
    async getUserShiftsByRoster(userId: string, rosterId: string): Promise<ErrorTypes | Shift[]> {
        const shifts = await this.prisma.shift.findMany({
            where: {
                AND: {
                userId: userId,
                rosterId: rosterId
                }
            }
        });
        if (!shifts) {
            return {
                code: 500,
                message: "Erro de busca de turnos."
            }
        }
        return shifts;
    }
    async getRosterByMonthAndDepartment(month: $Enums.Months ,year: number, departmentId: string): Promise<ErrorTypes | Roster> {
        
        const roster = await this.prisma.roster.findFirst({
            where: {
                AND: {
                month: month,
                year: year,
                departmentId: departmentId
                }
            }
        })
        if (!roster) {
            return {
                code: 500,
                message: "Erro de busca de escala."
            }
        }
        return roster;
    }
   
    async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }

}