
import { getRosters } from "./actions"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card"
import { generateUniqueKey } from "@/src/lib/utils"
import { Roster } from "@prisma/client"
import ActionsCell from "@/src/components/tables/ActionsCell"
import { removeRoster } from "./createRoster/action"
import { UpdateRosterComponent } from "@/src/components/update/roster/UpdateRosterComponent"
import { EmptyComponentCard } from "@/src/components/emptyComponents/EmptyComponentCard"




export default async function RosterPage() {


    async function handleRemoveRoster(id:string){
        "use server"
        const result = await removeRoster(id)
        return result
    }

    const rosters = await getRosters()
    const isErrorTypes = "code" in rosters
    if(isErrorTypes){
        return(
            <EmptyComponentCard
            title="Escalas"
            error={rosters}
            >
                Não há escalas cadastradas.
            </EmptyComponentCard>
        )
    }
    const pageTitle = "Escalas"
    if(rosters.length === 0){
        return(
            <EmptyComponentCard
            title={pageTitle}
            error={{code: 404 ,message:"Não há escalas cadastradas no sistema"}}
            >
                Não há escalas cadastradas.
            </EmptyComponentCard>
        )
    }

    
    const headingKeys = Object.keys(rosters[0]).filter(key => key !== "id" && key !== "created_at" && key !== "updatedAt" && key !== "departmentId" && key !== "shiftsId")
    return(
    
        
    
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
                            headingKeys.map((key) => {
                                return <TableHead key={generateUniqueKey()}>{key}</TableHead>
                            }
                            )
                            }
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rosters.map(roster => {
                            const {id:rosterId,departmentId,created_at,...otherPropsFromRoster} = roster
                            
                            return (
                            <TableRow key={rosterId}>
                                {
                                    headingKeys.map((key) => {
                                        return <TableCell key={generateUniqueKey()}>{key !== "id" && key !== "createdAt" && key !== "updatedAt" && key !== "departmentId"?
                                        String(roster[key as keyof Roster]) : null
                                        }</TableCell>
                                    })
                                }
                                    <ActionsCell id={rosterId} handleRemoveItem={handleRemoveRoster} >
                                    <UpdateRosterComponent
                                    id={rosterId}
                                    defaultRosterValues={{...otherPropsFromRoster,
                                    year: String(roster.year),
                                    month: roster.month as string,
                                    maxWorkingHoursPerRoster: roster.maxWorkingHoursPerRoster ?? 0,
                                    minWorkingHoursPerRoster: roster.minWorkingHoursPerRoster ?? 0,
                                    }}
                                    />
                                    </ActionsCell>
                            </TableRow>
                            
                        )})}
                    </TableBody>
                </Table>

                    </CardContent>
                </Card>
               
            )
         


}