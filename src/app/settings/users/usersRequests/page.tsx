



import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { EmptyComponentCard } from '@/src/components/emptyComponents/EmptyComponentCard';
import { EmptySettingsComponent } from '@/src/components/emptyComponents/empytySettingsComponent';
import { getUsersThatIsNotApproved } from '../actions';
import { getDepartmentBySession } from '@/src/app/cadastrarOrgao/actions';
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell ,Table} from '@/src/components/ui/table';
import { ApprovalButton } from './ApprovalButton';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string;};
}) {
  
  const search = searchParams.q ?? '';
  
  const users = await getUsersThatIsNotApproved()
  const hasError = "code" in users
  if(hasError){
    return(
      <EmptyComponentCard
      title='Usuários'
      error={users}
      >
        Não foi encontrado nenhuma Solicitação de cadastro.
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

  const pageTitle = `Usuários tentando se cadastrar no ${department.name}`
 

  return (
    <>
    {
      users.length === 0 ? (
        <EmptySettingsComponent
        pageTitle={pageTitle}
        pageSubtitle="Nenhuma solicitação de cadastro encontrada."
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
        <Table>
  <TableCaption>Usuários tentando se cadastrar no seu órgão ATS</TableCaption>
  <TableHeader>
    <TableRow>
       
      <TableHead className="w-[100px]">Usuário</TableHead>
      <TableHead className="w-[100px]">Aprovar</TableHead>
  
    </TableRow>
  </TableHeader>
  <TableBody>
    {
        users.map((user) => {
            return (
            <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <ApprovalButton id={user.id!}/>
                </TableCell>
            </TableRow>
            )})
    }
  </TableBody>
</Table>
        </CardContent>
      </Card>
      )
    }
    </>

  );
}
