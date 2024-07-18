import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card';
import { getDepartmentBySession } from '../../../cadastrarOrgao/actions';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/src/components//ui/tabs';
import { CreateUserComponent } from '@/src/components/register/user/CreateUserComponent';
import { CreateManyUsersComponent } from '@/src/components/register/user/CreateManyUsersComponent';
import { EmptyComponentCard } from '@/src/components/emptyComponents/EmptyComponentCard';

export default async function createUser({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const department = await getDepartmentBySession();
  const hasErrorOnDepartment = 'code' in department;
  if (hasErrorOnDepartment) {
    return (
      <EmptyComponentCard error={department} title="Erro">
        Não foi possível carregar o Órgão.
      </EmptyComponentCard>
    );
  }

  const pageTitle = `Criar usuários para o ${department.name}`;

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>{pageTitle}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap flex-col gap-4">
        <Tabs defaultValue="createManyUsers" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="createSingleUser">Criar um usuário</TabsTrigger>
            <TabsTrigger value="createManyUsers">
              Criar Vários usuários
            </TabsTrigger>
          </TabsList>
          <TabsContent value="createSingleUser">
            <CreateUserComponent department={department} />
          </TabsContent>
          <TabsContent value="createManyUsers">
            <CreateManyUsersComponent search={search} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
