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
import { EmptyComponentCard } from '@/src/components/emptyComponents/EmptyComponentCard';
import { SignInLPNAComponent } from '@/src/components/register/lpna/SignInLPNAComponent';
import { getLPNAData } from './actions';
import { isErrorTypes } from '@/src/types';
import { EraseDataLpnaButton } from './EraseDataLPNAButton';

export default async function integrateWithLpnaPage({
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
  const access_token = localStorage.getItem('access_token');
  const lpnaData = access_token
    ? await getLPNAData()
    : { users: [], shifts: [], rosters: [] };
  const hasErrorOnLPNA = isErrorTypes(lpnaData);
  if (hasErrorOnLPNA) {
    return (
      <EmptyComponentCard error={lpnaData} title="Erro">
        <EraseDataLpnaButton />
      </EmptyComponentCard>
    );
  }

  const { users, shifts, rosters } = lpnaData;

  const pageTitle = `Integrar dados do Shift-App-${department.name} com a LPNA-Decea`;

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>{pageTitle}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap flex-col gap-4">
        {users.length > 0 || shifts.length > 0 || rosters.length > 0 ? 
        <>
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Usuários</h2>
                <ul className="list-disc list-inside">
                <li>Quantidade de usuários: {users.length}</li>
                <li>Quantidade de turnos: {shifts.length}</li>
                <li>Quantidade de escalas: {rosters.length}</li>
                </ul>
            </div>
            <EraseDataLpnaButton />
        </>
        
        : 
        (
          <Tabs defaultValue="createManyUsers" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="signInLPNA">Credenciais LPNA</TabsTrigger>
            </TabsList>
            <TabsContent value="signInLPNA">
              <SignInLPNAComponent />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
