import { ErrorComponent } from '@/src/components/errorComponent';
import { getUsersWithFilter } from './actions';
import { getDepartmentBySession } from '../../cadastrarOrgao/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { EmptySettingsComponent } from '@/src/components/empytySettingsComponent';
import { UserTable } from '@/src/components/tables/UserTable';
import { Search } from '@/src/components/search';
import { User } from '@prisma/client';

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

 

  return (
    <>
    {
      users.length === 0 ? (
        <EmptySettingsComponent
        pageTitle={pageTitle}
        pageSubtitle="Nenhum usuário cadastrado."
        >
          <Search value={search} />
        </EmptySettingsComponent>

      ) : 
      (
        <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-wrap flex-col gap-4' >
        <UserTable users={users as User[]}  search={search}/>
        </CardContent>
      </Card>
      )
    }
 

    </>

  );
}
