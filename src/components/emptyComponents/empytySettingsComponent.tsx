import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface EmptySettingsComponentProps {
    pageTitle: string
    children?:ReactNode
    pageSubtitle?: string
}

export function EmptySettingsComponent( {pageTitle, children, pageSubtitle}: EmptySettingsComponentProps) {
    return (
        <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>{pageTitle}</CardTitle>
                        <CardDescription>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {children}
                        {pageSubtitle && <p className="mb-4">{pageSubtitle}</p>}
                    </CardContent>
                </Card>
    )
}