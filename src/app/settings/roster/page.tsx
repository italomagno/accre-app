import { ErrorComponent } from "@/src/components/errorComponent"
import { getRosters } from "./actions"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { SkeletonTable } from "@/src/components/tables/SkeletonTable"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card"
import { generateUniqueKey } from "@/src/lib/utils"
import { Roster } from "@prisma/client"




export default async function RosterPage() {

    const rosters = await getRosters()
    const isErrorTypes = "code" in rosters
    if(isErrorTypes){
        return(
            <ErrorComponent
            error={rosters}
            />
        )
    }
    
    
    return(
        <>
        {
            rosters.length > 0 ? (
                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>Escalas</CardTitle>
                        <CardDescription>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                            {
                            Object.keys(rosters[0]).map((key) => {
                                return <TableHead key={generateUniqueKey()}>{key}</TableHead>
                            }
                            )
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rosters.map(roster => (
                            <TableRow key={roster.id}>
                                {
                                    Object.keys(rosters[0]).map((key) => {
                                        return <TableCell key={generateUniqueKey()}>{(roster[key as keyof Roster] as string)}</TableCell>
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
                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>Escalas</CardTitle>
                        <CardDescription>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Não há escalas cadastradas</p>
                    </CardContent>
                </Card>
                
            )
        }
        </>

        
    )
}