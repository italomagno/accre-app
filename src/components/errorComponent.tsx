"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/src/components/ui/card"
import { useToast } from "@/src/components/ui/use-toast"
import { ErrorTypes } from "@/src/types"


interface errorComponentProps {
    error: ErrorTypes
}

export function ErrorComponent( {error}: errorComponentProps) {
    const {toast} = useToast()
    toast({
        title: 'Error',
        description: error.message,
    })
    return (
        <Card>
            <CardContent>
                <CardTitle>
                    Error
                </CardTitle>
                <CardDescription>
                Houver um erro ao carregar esta página. Por favor, tente novamente mais tarde.
                </CardDescription>
            </CardContent>
        </Card>
    )
}