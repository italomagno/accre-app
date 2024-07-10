import { generateUniqueKey } from "@/src/lib/utils";
import { TableHeader, TableRow, TableHead, TableBody,Table, TableCell } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { ReactNode } from "react";

export function SkeletonTable(){
    const emptySkeletonKeys = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
    const emptySkeletonRows = emptySkeletonKeys.map(key=>emptySkeletonKeys.map(cells=><Skeleton key={generateUniqueKey()} className="h-4 w-full"/>
))
    
    return(
        <Table className="overflow-auto max-h-dvh" >
            <TableHeader className="w-fit">
              <TableRow>
                {
                emptySkeletonKeys.map((key, i) => (
                  <TableHead key={`${generateUniqueKey()}-component-th-${i}`} className="max-w-[150px]">
                    <Skeleton className="h-4 w-full"/>
                  </TableHead>
                ))
                }
              </TableRow>
            </TableHeader>
            <TableBody >
              {emptySkeletonRows.map((cells) => (
                <SkeletonRow key={generateUniqueKey()} cells={cells}   />
              ))}
            </TableBody>
          </Table>
    )
}

function SkeletonRow({ cells }:{cells:ReactNode[]}) {


    return (
      <TableRow>
        
        {
        cells.map((cell, i) => (
          <TableCell key={`${generateUniqueKey()}-component-td-${i}`} className="max-w-[150px]">
            {cell}
          </TableCell>
        ))
        }
      </TableRow>
    );
  }