import { ErrorComponent } from "@/src/components/errorComponent"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card"
import { generateUniqueKey } from "@/src/lib/utils"
import { Shift } from "@prisma/client"
import { EmptySettingsComponent } from "@/src/components/empytySettingsComponent"
import { getShifts } from "./action"




export default async function shiftPage() {

    const shifts = await getShifts()
    const isErrorTypes = "code" in shifts
    if(isErrorTypes){
        return(
            <ErrorComponent
            error={shifts}
            />
        )
    }
    const pageTitle = "Escalas"
    
    
    return(
        <>
        {
            shifts.length > 0 ? (
                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>{pageTitle}</CardTitle>
                        <CardDescription>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                            {
                            Object.keys(shifts[0]).map((key) => {
                                return <TableHead key={generateUniqueKey()}>{key}</TableHead>
                            }
                            )
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shifts.map(shift => (
                            <TableRow key={shift.id}>
                                {
                                    Object.keys(shifts[0]).map((key) => {
                                        return <TableCell key={generateUniqueKey()}>{(shift[key as keyof Shift] as string)}</TableCell>
                                    })
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                    </CardContent>
                </Card>
               
            ) : 
            (
                <EmptySettingsComponent
                pageTitle={pageTitle}
                pageSubtitle="Não há escalas cadastradas."
                />
            )
        }
        </>

        
    )
}