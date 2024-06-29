"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/src/components/ui/card"
import { useToast } from "@/src/components/ui/use-toast"
import { ErrorTypes } from "@/src/types"
import { useEffect } from "react"


interface errorComponentProps {
    error: ErrorTypes
}

export function ErrorComponent( {error}: errorComponentProps) {
    const {toast} = useToast()
    useEffect(() => {
        toast({
            title: 'Erro',
            description: error.message,
        })
    }, [error, toast]);
    return (
        <Card x-chunk="dashboard-04-chunk-1 p-4">
            <CardContent>
                <CardTitle className="pt-4">
                    Error
                </CardTitle>
                <CardDescription className="pt-4">
                Houver um erro ao carregar esta página. Por favor, tente novamente mais tarde.
                </CardDescription>
            </CardContent>
        </Card>
    )
}