"use client"

import { Roster, User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { useToast } from "../../ui/use-toast"
import { updateUser } from "@/src/app/settings/users/createUser/actions"
import { UpdateUserComponent } from "../../update/user/UpdateUserComponent"
import { removeUser } from "@/src/app/settings/users/actions"
import NewActionsCell from "./newActionsCell"
import { updateRoster } from "@/src/app/settings/roster/createRoster/action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "function",
        header: "Função",
    },
    {
        accessorKey: "isOffice",
        header: "Expediente",
        cell: (cell) => {

            const {toast} = useToast()
            const oldData = cell.row.original

            async function handleIsOfficeChange(value:string){
                const {id,...dataWithoutId} = oldData
                
                const booleanValue = value === "true" ? true : false
                const newData = {...dataWithoutId,isOffice:booleanValue}
                
               const resutFromUpdateUser = await updateUser(id,newData)
               if(resutFromUpdateUser.code === 200){
                toast({
                    title: "Usuário atualizado com sucesso",
                    description: "O usuário foi atualizado com sucesso."
                })
            }else{
                toast({
                    title: "Erro ao atualizar usuário",
                    description: resutFromUpdateUser.message
                })
            
            }
            }
            return(
                <Select onValueChange={handleIsOfficeChange}
                defaultValue={String(cell.getValue())}
                >
                            <SelectTrigger>
                              <SelectValue placeholder="O usuário trabalha no expediente?" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem
                                  value={"true"}
                                >
                                  Sim
                            </SelectItem>
                            <SelectItem
                                  value={"false"}
                                >
                                  Não
                            </SelectItem>
                             
                            </SelectContent>
                          </Select>
            )
        }
    },
    {
        accessorKey: "block_changes",
        header: "Bloquear alterações",
        cell: (cell) => {
const {toast} = useToast()

            const oldData = cell.row.original

            async function handleBlockChangesChange(value:string){
                const {id,...dataWithoutId} = oldData
                
                const booleanValue = value === "true" ? true : false
                const newData = {...dataWithoutId,block_changes:booleanValue}
                
               const resutFromUpdateUser = await updateUser(id,newData)
               if(resutFromUpdateUser.code === 200){
                toast({
                    title: "Usuário atualizado com sucesso",
                    description: "O usuário foi atualizado com sucesso."
                })
            }else{
                toast({
                    title: "Erro ao atualizar usuário",
                    description: resutFromUpdateUser.message
                })
            
            }
            }
            return(
                <Select onValueChange={handleBlockChangesChange}
                defaultValue={String(cell.getValue())}
                >
                            <SelectTrigger>
                              <SelectValue placeholder="Bloquear alterações?" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem
                                  value={"true"}
                                >
                                  Sim
                            </SelectItem>
                            <SelectItem
                                  value={"false"}
                                >
                                  Não
                            </SelectItem>
                             
                            </SelectContent>
                          </Select>
            )
        }
    },
    {
        accessorKey: "id",
        header: "Ações",
        cell: (cell) => {
const {toast} = useToast()

            const {id:userId,...otherPropsFromUser} = cell.row.original
            async function handleRemoveUser(id:string){
                const result = await removeUser(id)
                if(result.code === 200){
                    toast({
                        title: "Usuário removido com sucesso",
                        description: "O usuário foi removido com sucesso."
                    })
                }
                else{
                    toast({
                        title: "Erro ao remover usuário",
                        description: result.message
                    })
                }
                return result
              }
            return(
                <NewActionsCell id={userId} handleRemoveItem={handleRemoveUser}>
                <UpdateUserComponent
                id={userId?? ""}
                defaultUserValues={{...otherPropsFromUser,function:String(cell.row.original.function)}}
                />
                </NewActionsCell>
            )
        }
    },
  
]

export const rosterColumns: ColumnDef<Roster>[] = [
    {
        accessorKey: "month",
        header: "Mês",
    },
    {
        accessorKey: "year",
        header: "Ano",
    },
    {
        accessorKey: "minWorkingHoursPerRoster",
        header: "Horas mínimas",

    },
    {
        accessorKey: "maxWorkingHoursPerRoster",
        header: "Horas máximas",
    },
    {
        accessorKey: "minWorkingDaysOnWeekEnd",
        header: "Dias mínimos no fim de semana",
    },
    {
        accessorKey: "blockChanges",
        header: "Bloquear alterações",
        cell: (cell) => {
            const {toast} = useToast()
            const oldData = cell.row.original

            async function handleBlockChangesChange(value:string){
                const {id,...dataWithoutId} = oldData
                
                const booleanValue = value === "true" ? true : false
                const newData = {...dataWithoutId,blockChanges:booleanValue}
                
               const resutFromUpdateUser = await updateRoster(id,newData as Roster)
               if(resutFromUpdateUser.code === 200){
                toast({
                    title: "Sucesso",
                    description: "Escala atualizado com sucesso."
                })
            }else{
                toast({
                    title: "Erro",
                    description: resutFromUpdateUser.message
                })
            
            }
            }
            return(
                <Select onValueChange={handleBlockChangesChange}
                defaultValue={String(cell.getValue())}
                >
                            <SelectTrigger>
                              <SelectValue placeholder="Bloquear alterações?" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem
                                  value={"true"}
                                >
                                  Sim
                            </SelectItem>
                            <SelectItem
                                  value={"false"}
                                >
                                  Não
                            </SelectItem>
                             
                            </SelectContent>
                          </Select>
            )
        }

    },
    {
        accessorKey: "id",
        header: "Excluir escala",
        cell: (cell) => {
            const {id:rosterId} = cell.row.original
            return(
                <NewActionsCell id={rosterId} handleRemoveItem={removeUser}>
                </NewActionsCell>
            )
        }
    },


]
