
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
    <>
      {shifts.length > 0 ? (
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {shiftsHeadingsWithOutIds.map((key) => {
                    return (
                      <TableHead key={generateUniqueKey()}>{key}</TableHead>
                    );
                  })}
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => {
                  const isNexDay =
                    new Date(shift.start).getDate() !==
                    new Date(shift.end).getDate();
                  const startTime = new Date(shift.start).toLocaleTimeString(
                    'pt-BR',
                    {
                      hour: '2-digit',
                      minute: '2-digit'
                    }
                  ).replace(':', '');
                  const endTime = new Date(shift.end).toLocaleTimeString(
                    'pt-BR',
                    {
                      hour: '2-digit',
                      minute: '2-digit'
                    }
                ).replace(':', '');
                  const defaultInformationsValues: CreateShiftValues = {
                    name: shift.name,
                    quantity: String(shift.quantity),
                    minQuantity: String(shift.minQuantity),
                    isAvailable: shift.isAvailable,
                    isAbscence: shift.isAbscence,
                    dateStartEnd: {
                      start: startTime,
                      end: endTime,
                      isNextDay: isNexDay
                    },
                    isOnlyToSup: shift.isOnlyToSup,
                    quantityInWeekEnd: String(shift.quantityInWeekEnd),
                    minQuantityInWeekEnd: String(shift.minQuantityInWeekEnd),
                    maxQuantity: String(shift.maxQuantity),
                  };
                  return (
                    <TableRow key={shift.id}>
                      {shiftsHeadingsWithOutIds.map((key) => {
                        const isStartOrEnd =
                          key.toLocaleLowerCase().includes('start') ||
                          key.toLocaleLowerCase().includes('end');
                        const getTimeFromStartOrEnd = isStartOrEnd
                          ? new Date(
                              shift[key as keyof Shift] as string
                            ).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '';
                        return (
                          <TableCell key={generateUniqueKey()}>
                            {typeof shift[key as keyof Shift] === 'object'
                              ? isStartOrEnd
                                ? getTimeFromStartOrEnd
                                : new Date(
                                    shift[key as keyof Shift] as string
                                  ).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })
                              : String(shift[key as keyof Shift])}
                          </TableCell>
                        );
                      })}
                      <ActionsCell id={shift.id} handleRemoveItem={handleRemoveItem}>
                        <UpdateShiftComponent
                          id={shift.id}
                          defaultShiftValues={defaultInformationsValues}
                        />
                      </ActionsCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptySettingsComponent
          pageTitle={pageTitle}
          pageSubtitle="Não há turnos cadastrados."
        />
      )}
    </>
  );
}
