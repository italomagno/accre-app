"use client"


import { Separator } from "@/src/components/ui/separator"
import { InformationCreateManyUsersButton } from "../../informationCreateManyUsersButton"
import { FileInput } from "../../ui/file-input"

export function CreateManyUsersComponent() {

    return (
        <>
         <div className="flex justify-between items-center mt-4">
            <div>
            <h1 className="text-3xl font-bold">Dados dos Usuários</h1>
            </div>
            <div><InformationCreateManyUsersButton/></div>
        </div>
        <Separator/>
        <div className="mt-4">
            <FileInput/>
        </div>
          </>
    )
}