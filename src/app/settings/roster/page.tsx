
import { getRosters } from "./actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card"

import { EmptyComponentCard } from "@/src/components/emptyComponents/EmptyComponentCard"
import { DataTable } from "@/src/components/tables/data/dataTable"
import { rosterColumns } from "@/src/components/tables/data/Columns"




export default async function RosterPage() {



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

    
    return(
    
        
    
                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>{pageTitle}</CardTitle>
                        <CardDescription>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={rosterColumns} data={rosters} />
                   {/*  <Table>
                    <TableHeader className="w-fit">
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
                </Table> */}

                    </CardContent>
                </Card>
               
            )
         


}