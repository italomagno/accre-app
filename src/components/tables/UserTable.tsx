"use client"
import { generateUniqueKey } from "@/src/lib/utils";
import { User } from "@prisma/client";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/src/components/ui/table";
import { Search } from "../search";
import ActionsCell from "./ActionsCell";
import { removeUser } from "@/src/app/settings/users/actions";
import { UpdateUserComponent } from "../update/user/UpdateUserComponent";

type UserTableProps = {
    users: (Partial<User> & {[key:string]:any})[];
    search: string;
    } 

export function UserTable({users,search}: UserTableProps ) {
    const headingKeys = Object.keys(users[0])

    const filteredUsers = users.filter((user) => {
      
        return Object.values(user).some((value) => {
          return String(value).toLowerCase().includes(search.toLowerCase());
        });
      }
    );

    async function handleRemoveUser(id:string){
      const result = await removeUser(id)
      console.log(result)
      return result
    }
    
    return(
        <>
        <div className="w-full">
        <Search value={search} />
      </div>
      <ScrollArea className='w-96 h-52 lg:w-full'>
      <Table >
                    <TableHeader className="w-fit">
                        <TableRow>
                            {
                            headingKeys.map((key) => {

                                return key === "id" || key === "role" ? null :<TableHead key={generateUniqueKey()}>{key}</TableHead>
                            }
                            )
                            }
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const {id:userId,...otherPropsFromUser} = user
                        
                        return (
                        <TableRow key={userId}>
                          {headingKeys.map((key) => {
                            return (
                              key === "id" || key === "role"? null :<TableCell  key={generateUniqueKey()}>
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
                          <ActionsCell id={userId} handleRemoveItem={handleRemoveUser}>
                          <UpdateUserComponent
                          id={userId?? ""}
                          defaultUserValues={{...otherPropsFromUser,function:String(user.function)}}
                          />
                          </ActionsCell>
                        </TableRow>
                      )})}
                    </TableBody>
                </Table>
                <ScrollBar orientation="vertical" />
                <ScrollBar orientation="horizontal" />


      </ScrollArea>
      </>

    )
}