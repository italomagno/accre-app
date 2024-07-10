
import { getUsersWithFilter } from './actions';
import { getDepartmentBySession } from '../../cadastrarOrgao/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { UserTable } from '@/src/components/tables/UserTable';
import { Search } from '@/src/components/search';
import { User } from '@prisma/client';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { EmptyComponentCard } from '@/src/components/emptyComponents/EmptyComponentCard';
import { EmptySettingsComponent } from '@/src/components/emptyComponents/empytySettingsComponent';

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
      users.length === 0 ? (
        <EmptySettingsComponent
        pageTitle={pageTitle}
        pageSubtitle="Nenhum usuário cadastrado."
        >
          <div className="flex flex-col gap-4">
            <div><Button><Link href={'/'} >Retornar para página inicial.</Link></Button></div>
          </div>
        </EmptySettingsComponent>

      ) 
      : 
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
