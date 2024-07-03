"use client"

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/src/components/ui/card"
import { useToast } from "@/src/components/ui/use-toast"
import { ErrorTypes } from "@/src/types"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "../ui/button"


interface EmptyComponentCardProps {
    title: string;
    error: ErrorTypes
    children: React.ReactNode
}

export function EmptyComponentCard( {error,children,title}: EmptyComponentCardProps) {
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
                    {title}
                </CardTitle>
                <CardDescription className="pt-4">
                {children}
                </CardDescription>
            </CardContent>
            <CardFooter>
                <Button variant="link"><Link href={"/"}>Retornar à página inicial</Link></Button>
            </CardFooter>
        </Card>
    )
}