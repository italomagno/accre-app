"use client"
import { ErrorTypes } from "@/src/types"
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";

type ShowToastComponentProps = {
    error: ErrorTypes
}


export function ShowToastComponent(  {error}: ShowToastComponentProps){
    const {toast} = useToast()

    useEffect(() => {
        toast({
            title: 'Erro',
            description: error.message,
        })
    }, [error]);

    return (
        <div>
        </div>
    )
}