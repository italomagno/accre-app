import {  User } from '@prisma/client';
import { Search } from '../../../components/search';
import { ErrorComponent } from '@/src/components/errorComponent';
import { getUsersWithFilter } from './actions';
import { getDepartmentBySession } from '../../cadastrarOrgao/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { TableHeader, TableRow, TableHead, TableBody, TableCell,Table } from '@/src/components/ui/table';
import { generateUniqueKey } from '@/src/lib/utils';
import { EmptySettingsComponent } from '@/src/components/empytySettingsComponent';
import { ScrollArea, ScrollBar } from '@/src/components/ui/scroll-area';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string;};
}) {
  
  const search = searchParams.q ?? '';
  
  const users = await getUsersWithFilter(search)
  const hasError = "code" in users
  if(hasError){
    return(
      <ErrorComponent
      error={users}
      />
    )
  }
  const department = await getDepartmentBySession()
  const hasErrorOnDepartment = "code" in department
  if(hasErrorOnDepartment){
    return(
      <ErrorComponent
      error={department}
      />
    )
  }

  const pageTitle = `Usuários Cadastrados no ${department.name}`

  console.log(users)
 

  return (
    <>
    {
      users.length === 0 ? (
        <EmptySettingsComponent
        pageTitle={pageTitle}
        pageSubtitle="Nenhum usuário cadastrado."
        />
      ) : 
      (
        <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-wrap flex-col gap-4' >
        <div className="w-full">
          <Search value={searchParams.q} />
        </div>
        <ScrollArea className='w-96 lg:w-full'>
        <Table >
                      <TableHeader>
                          <TableRow>
                              {
                              Object.keys(users[0]).map((key) => {
                                  return <TableHead key={generateUniqueKey()}>{key}</TableHead>
                              }
                              )
                              }
                          </TableRow>
                      </TableHeader>
                      <TableBody >
                          {users.map(user => (
                              <TableRow key={user.id}>
                                  {
                                      Object.keys(users[0]).map((key) => {

                                        // ToDo: Fix this error types on the next line
                                        //@ts-ignore
                                          return <TableCell key={generateUniqueKey()}>{(typeof user[key as keyof User]) === "object" ? new Date(user[key as keyof User]).toLocaleDateString(
                                            'pt-BR',
                                            {
                                              day: '2-digit',
                                              month: '2-digit',
                                              year: 'numeric',
                                            }
                                        //@ts-ignore
                                          ) : String(user[key as keyof User])}</TableCell>
                                      })
                                  }
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                  <ScrollBar orientation="vertical" />

        </ScrollArea>

          
        </CardContent>
      </Card>
      )
    }
 

    </>

  );
}
