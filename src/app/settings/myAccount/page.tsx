
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { getUserProfile } from './actions';
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table';
import { Table } from '@/src/components/ui/table';
import { EmptyComponentCard } from '@/src/components/EmptyComponentCard';
import ActionsCell from '@/src/components/tables/ActionsCell';
import { UpdateMyAccountComponent } from '@/src/components/update/user/UpdateMyAccountComponent';

export default async function MyAccountPage() {
    const user = await getUserProfile()

    if("code" in user){
      return (
        <EmptyComponentCard title={"Minha Conta"} error={user}>
          Suas informações pessoais não puderam ser carregadas
        </EmptyComponentCard>
      )
    }
    
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Minha Conta</CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-wrap' >
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead >Função Operacional</TableHead>
      <TableHead >Trabalha no expediente</TableHead>
      <TableHead>Trocas Bloqueadas</TableHead>
      <TableHead>Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell> {user.name} </TableCell>
        <TableCell> {user.email} </TableCell>
        <TableCell>{user.function}</TableCell>
        <TableCell>{String(user.isOffice)}</TableCell>
        <TableCell>{String(user.block_changes)}</TableCell>
        <ActionsCell>
          <UpdateMyAccountComponent id={user.id} defaultUserValues={{
            ...user,
            password: user.password ?? "",
            }} />
        </ActionsCell>
    </TableRow>
  </TableBody>
</Table>

      </CardContent>
      <CardFooter>
      </CardFooter>
      </Card>
  );
}