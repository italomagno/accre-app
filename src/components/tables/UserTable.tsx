"use client"
import { generateUniqueKey } from "@/src/lib/utils";
import { User } from "@prisma/client";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/src/components/ui/table";
import { Search } from "../search";

type UserTableProps = {
    users: (Pick<User,"email"| "function" | "name"> & {[key:string]:any})[];
    search: string;
    } 

export function UserTable({users,search}: UserTableProps ) {
    const headingKeys = Object.keys(users[0])

    return(
        <>
        <div className="w-full">
        <Search value={search} />
      </div>
      <ScrollArea className='w-96 lg:w-full'>
      <Table >
                    <TableHeader>
                        <TableRow>
                            {
                            headingKeys.map((key) => {
                                return <TableHead key={generateUniqueKey()}>{key}</TableHead>
                            }
                            )
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          {Object.keys(users[0]).map((key) => {
                            return (
                              <TableCell key={generateUniqueKey()}>
                                {
                                  
                                typeof user[key] === "object"
                                  ? new Date(user[key] as string).toLocaleDateString(
                                      "pt-BR",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      }
                                    )
                                  : String(user[key])}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
                <ScrollBar orientation="vertical" />

      </ScrollArea>
      </>

    )
}