"use client"
import { ErrorTypes } from "@/src/types";
import { useToast } from "../../ui/use-toast";
import { useEffect } from "react";
import { LayoutComponent } from "@/src/app/LayoutComponent";



type EmptyHomePageComponentProps = {
      toast: ErrorTypes
  }



export function EmptyHomePageComponent( {toast:toastFromComponent}: EmptyHomePageComponentProps) {
  const {toast} = useToast()
  useEffect(() => {
    toast({
        title: `Código ${toastFromComponent.code}`,
        description: toastFromComponent.message,
    })
}
, [toastFromComponent]);

    return (
      <LayoutComponent>
        <main className="w-dvw h-dvh flex justify-center items-center mt-14 px-14">
          <div>
            <h1 className="text-2xl font-bold text-center">Bem vindo ao sistema de escalas</h1>
            <p className="text-center mt-5">Aqui você pode visualizar as escalas de trabalho e os turnos cadastrados.</p>
            <p className="text-center">Caso você seja um administrador, você pode cadastrar novas escalas e turnos.</p>
            <p className="text-center">Caso você seja um usuário, você pode visualizar as escalas e turnos cadastrados.</p>
          </div>
        
        </main>
      </LayoutComponent>

    )
}