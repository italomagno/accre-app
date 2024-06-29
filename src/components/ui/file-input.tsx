"use client"
import { SVGProps, useEffect, useState } from "react"
import { Button } from "./button"
import { useFormState, useFormStatus } from "react-dom"
import { handleFileInputForManyUsers } from "@/src/app/settings/users/createUser/actions"
import { useToast } from "./use-toast"
import { User } from "@prisma/client"
import { UserTable } from "../tables/UserTable"

type FileInputProps = {
  search:string
}

export function FileInput({search}:FileInputProps) {
  const {toast} = useToast();
  const [users, setUsers] = useState<Pick<User, "name" | "email" | "function">[]>()

  const [state,formAction]= useFormState(handleFileInputForManyUsers,null)
  const {pending} = useFormStatus()


  useEffect(()=>{
    if(state){
      if(state.code === 200){
        toast({
          title: "Usuários cadastrados com sucesso",
          description: "Aguarde Redirecionamento"
        })
        //ToDo:create state to user
        if("users" in state){
          const {users} = state
          setUsers(users)
        }
      }else{
        toast({
          title: "Erro ao cadastrar usuários",
          description: state.message
        })
      }
    }
  }
  ,[state])

  //ToDo: Implement file loading state
  return (
    <>
    {
      users && users.length>0 ?
      <UserTable users={users} search={search}  />
        :
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4">
              <form action={formAction} >
          <div className="flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed border-primary rounded-md bg-background hover:bg-muted transition-colors relative pointer-events-none">
              <UploadIcon className="w-10 h-10 text-primary" />
              <h3 className="mt-4 text-lg font-medium">Faça o upload do arquivo .csv</h3>
              <p className="mt-2 text-sm text-muted-foreground">Arraste e solte o arquivo ou clique para seleciona-lo</p>
              <input type="file" accept=".csv" name="file" className="absolute inset-0 w-full h-full cursor-pointer pointer-events-auto" />
          </div>
          <p className="text-sm text-muted-foreground">Apenas arquivos .csv são aceitos. Tamanho máximo do arquivo é: 5MB.</p>
          <Button disabled={pending} type="submit">Ler arquivo CSV.</Button>
          </form>
      </div>
    }
      
    </>
  )
}

function UploadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
