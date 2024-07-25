"use client"

import { Roster, Shift, User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { useToast } from "../../ui/use-toast"
import { updateUser } from "@/src/app/settings/users/createUser/actions"
import { UpdateUserComponent } from "../../update/user/UpdateUserComponent"
import { removeUser } from "@/src/app/settings/users/actions"
import NewActionsCell from "./newActionsCell"
import { updateRoster } from "@/src/app/settings/roster/createRoster/action"
import { Button } from "../../ui/button"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

"created_at	name	start	end	quantity	minQuantity	quantityInWeekEnd	minQuantityInWeekEnd	maxQuantity	isOnlyToSup	isAvailable	isAbscence	Actions"
export const ShiftColumns: ColumnDef<Shift>[] = [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
      accessorKey: "created_at",
      header: "Criado em",
    },
    {
        accessorKey: "start",
        header: "Hora de início",
        cell: (cell) => {
            const date = new Date(cell.getValue() as string)
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })
        }
    },
    {
        accessorKey: "end",
        header: "Hora de término",
        cell: (cell) => {
            const date = new Date(cell.getValue() as string)
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })
        }
    },
    {
        accessorKey: "quantity",
        header: "Quantidade",
    },
    {
        accessorKey: "minQuantity",
        header: "Quantidade mínima",
    },
    {
        accessorKey: "quantityInWeekEnd",
        header: "Quantidade no fim de semana",
    },
    {
        accessorKey: "minQuantityInWeekEnd",
        header: "Quantidade mínima no fim de semana",
    },
    {
        accessorKey: "maxQuantity",
        header: "Quantidade máxima",
    },
    {
        accessorKey: "isOnlyToSup",
        header: "Dispoível apenas para supervisores?",
    },
    {
        accessorKey: "isAvailable",
        header: "Está disponível?",
    },
    {
        accessorKey: "isAbscence",
        header: "É Afastamento?",
    },
    {
        accessorKey: "id",
        header: "Ações",
        cell: (cell) => {
            const {id:shiftId} = cell.row.original
            return(
                <NewActionsCell id={shiftId} handleRemoveItem={removeUser}>
                </NewActionsCell>
            )
        }
    },
]

export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Nome
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
      
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
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Expediente
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
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
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Bloquear alterações
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
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

export const userLpnaColumns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Nome
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
      
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
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Expediente
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
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
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Bloquear alterações
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
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
