
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getSpreadSheetId } from "./actions";
import { InformationButton } from "@/src/components/informationButton";
import { SpreadSheetIdButton } from "@/src/components/register/spreadSheet/SpreadSheetIdButton";



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