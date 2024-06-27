import { SpreadSheetIdButton } from "@/src/components/register/SpreadSheetIdButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getSpreadSheetId } from "./actions";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card";
import { Button } from "@/src/components/ui/button";
import { CircleHelp, Copy } from "lucide-react";
import { Separator } from "@/src/components/ui/separator";
import { InformationButton } from "@/src/components/informationButton";



export default async function integrations(){
    const spreadSheetId = await getSpreadSheetId()
    return (
        <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div><span>Integrações</span></div>
                    <InformationButton/>
                </CardTitle>
                <CardDescription className="mt-2">
                Configure a integração com o google Sheets.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SpreadSheetIdButton
                spreadSheetId={typeof spreadSheetId === 'string' ? spreadSheetId : ''}
                />
            </CardContent>
        </Card>
    )
}