import { Badge } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { generateUniqueKey } from "../lib/utils";



export function ShowAvailableShiftsComponentLoading(){
        return (
                <>
                <Card key={generateUniqueKey()} className="w-full">
                <CardHeader>
                  <CardTitle><Skeleton className="h-4 w-40"/></CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 w-full">
                <Skeleton className="h-4 w-11"/>
                <Skeleton className="h-4 w-11"/>
                <Skeleton className="h-4 w-11"/>
                <Skeleton className="h-4 w-11"/>
                </CardContent>
              </Card>

              <Card key={generateUniqueKey()} className="w-full">
                <CardHeader>
                  <CardTitle><Skeleton className="h-4 w-40"/></CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 w-full">
                <Skeleton className="h-4 w-11"/>
                <Skeleton className="h-4 w-11"/>
                <Skeleton className="h-4 w-11"/>
                <Skeleton className="h-4 w-11"/>
                </CardContent>
              </Card>
              </>

        )
}




export function LoadingSkeleton(){
        return (
                <>
                <Skeleton className="h-16 w-dvw p-4" />
                <div className="grid w-dvw h-dvh gap-5 lg:grid-cols-[240px_1fr] p-4">
                <div className="flex flex-col p-4 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                </div>

                    <div className="flex flex-wrap gap-5">
                        <Skeleton className="h-96 w-[250px]" />
                        <Skeleton className="h-96 w-[200px]" />
                        <Skeleton className="h-96 w-[250px]" />
                        <Skeleton className="h-96 w-[200px]" />
                    </div>
                    
                    
            </div>
            </>
          )
}