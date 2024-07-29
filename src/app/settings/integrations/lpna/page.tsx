import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card';
import { getDepartmentBySession } from '../../../cadastrarOrgao/actions';
import { EmptyComponentCard } from '@/src/components/emptyComponents/EmptyComponentCard';
import { SignInLPNAComponent } from '@/src/components/register/lpna/SignInLPNAComponent';
import { getLPNAData, getLoginLPNA } from './actions';
import { isErrorTypes } from '@/src/types';
import { EraseDataLpnaButton } from './EraseDataLPNAButton';
import { cookies } from 'next/headers';
import { DataTable } from '@/src/components/tables/data/dataTable';
import { ShiftColumns, rosterColumns, userColumns } from '@/src/components/tables/data/Columns';
import { SaveAllDataButton } from './SaveAllDataButton';

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
  const access_token = cookies().get('lpna_access_token')?.value;
  const lpnaData = access_token
    ? await getLPNAData()
    : { users: [], shifts: [], rosters: [] };
  const hasErrorOnLPNA = isErrorTypes(lpnaData);
  if (hasErrorOnLPNA) {
    return (
      <EmptyComponentCard error={lpnaData} title="Erro">
        <EraseDataLpnaButton/>
      </EmptyComponentCard>
    );
  }

  const lpnaSavedData = await getLoginLPNA();
  if (isErrorTypes(lpnaSavedData)) {
    return (
      <EmptyComponentCard error={lpnaSavedData} title="Erro">
        <EraseDataLpnaButton/>
      </EmptyComponentCard>
    );
  }
  var defaultLoginValues = {
    email: lpnaSavedData.email ,
    password: lpnaSavedData.password,
    savePassword: true
  }
  const { users, shifts, rosters } = lpnaData;

  const pageTitle = `Integrar dados do Shift-App-${department.name} com a LPNA-Decea`;

  return (

    <>
    {users.length > 0 || shifts.length > 0 || rosters.length > 0 ? 
            <>
          <div className="flex flex-col gap-4">
          <div className='border border-spacing-1 p-4 rounded'>
          <div className="flex justify-between">
            <div><h2 className="text-xl font-bold mb-2">Usuários</h2></div>
            <div><SaveAllDataButton
            data={users} 
            /></div>
          </div>
          <DataTable columns={userColumns} data={users}/>
          </div>
          <div className='border border-spacing-1 p-4 rounded'>
          <div className="flex justify-between">
            <div><h2 className="text-xl font-bold mb-2">Turnos</h2></div>
            <div><SaveAllDataButton
            data={shifts} 
            /></div>
          </div>
          <DataTable columns={ShiftColumns} data={shifts}/>
          </div>
          <div className='border border-spacing-1 p-4 rounded'>
          <div className="flex justify-between">
            <div><h2 className="text-xl font-bold mb-2">Escalas</h2></div>
            <div><SaveAllDataButton
            data={rosters} 
            /></div>
          </div>
          <DataTable columns={rosterColumns} data={rosters}/>
          </div>
        
        </div><EraseDataLpnaButton /></>
        : 
        <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap flex-col gap-4">
              <SignInLPNAComponent
              defaultValues={defaultLoginValues} />
      </CardContent>
    </Card>
    }
        </>

  );
}
