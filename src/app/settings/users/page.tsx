
import { getUsersWithFilter } from './actions';
import { getDepartmentBySession } from '../../cadastrarOrgao/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';

import { EmptyComponentCard } from '@/src/components/emptyComponents/EmptyComponentCard';
import { DataTable } from '@/src/components/tables/data/dataTable';
import { userColumns } from '@/src/components/tables/data/Columns';
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
      <EmptyComponentCard
      title='Usuários'
      error={users}
      >
          <Search value={search} />
        Não foi encontrado nenhum usuário.
      </EmptyComponentCard>
    )
  }
  const department = await getDepartmentBySession()

  const hasErrorOnDepartment = "code" in department
  if(hasErrorOnDepartment){
    return(
      <EmptyComponentCard
      title='Erro'
      error={department}
      >
        Não foi possível carregar o Órgão.
      </EmptyComponentCard>
    )
  }




  const pageTitle = `Usuários Cadastrados no ${department.name}`

 

  return (
    <>
    {
      (
        <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent className='h-fit' >
          <DataTable columns={userColumns} data={users as User[]}         />
        {/* <UserTable users={users as User[]}  search={search}/> */}
        </CardContent>
      </Card>
      )
    }
    </>

  );
}
