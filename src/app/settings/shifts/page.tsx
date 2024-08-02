
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/src/components/ui/card';
import { generateUniqueKey } from '@/src/lib/utils';
import { Shift } from '@prisma/client';
import { getShifts, removeShift } from './action';
import ActionsCell from '@/src/components/tables/ActionsCell';
import { UpdateShiftComponent } from '@/src/components/update/shift/UpdateShiftComponent';
import { CreateShiftValues } from '@/src/types';
import { EmptyComponentCard } from '@/src/components/emptyComponents/EmptyComponentCard';
import { EmptySettingsComponent } from '@/src/components/emptyComponents/empytySettingsComponent';
import { DataTable } from '@/src/components/tables/data/dataTable';
import { ShiftColumns } from '@/src/components/tables/data/Columns';

export default async function shiftPage() {
  const shifts = await getShifts();
  const isErrorTypes = 'code' in shifts;
  if (isErrorTypes) {
    return <EmptyComponentCard  title='Turnos' error={shifts} >
      Não há turnos cadastrados.
    </EmptyComponentCard>;
  }
  const pageTitle = 'Turnos';

  const shiftsHeadingsWithOutIds = Object.keys(shifts[0]).filter(
    (key) => !key.toLocaleLowerCase().includes('id')
  );

  async function handleRemoveItem(id: string) {
    "use server"
    return await removeShift(id)
  }

  return (
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className='max-w-full overflow-auto'>
            <DataTable columns={ShiftColumns} data={shifts} />
          </CardContent>
        </Card>
      )
}
