
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { getUserProfile } from './actions';
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table';
import { Table } from '@/src/components/ui/table';

export default async function MyAccountPage() {
    const user = await getUserProfile()
    if(!user){
        return null
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
  <TableCaption>Suas informações pessoais</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>CPF</TableHead>
      <TableHead>Email</TableHead>
      <TableHead >Trabalha no expediente</TableHead>
      <TableHead >Função</TableHead>
      <TableHead>Trocas Bloqueadas</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
     {/*  <TableCell> {user.name}</TableCell>
        <TableCell >{user.cpf}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.isOffice}</TableCell>
        <TableCell>{user.function}</TableCell>
        <TableCell>{user.block_changes}</TableCell> */}
    </TableRow>
  </TableBody>
</Table>

      </CardContent>
      <CardFooter>
      </CardFooter>
      </Card>
  );
}