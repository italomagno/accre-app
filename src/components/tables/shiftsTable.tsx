'use client';

import {
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/src/components/ui/table';
import {
  createWorkDaysColumn,
  generateUniqueKey,
  getMonthFromRosterInNumber,
  handleCellColor
} from '@/src/lib/utils';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { ErrorTypes } from '@/src/types';
import { useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { TableHeaderSticky } from './TableHeaderSticky';

type UserToUserTable = {
  id: string;
  name: string;
};
export function ShiftsTable({
  shifts,
  users,
  roster,
  workDays,
  errors
}: {
  shifts: (Pick<Shift, 'id' | 'name' | 'quantity'> &
    Partial<{ [key: string]: any }>)[];
  users: (Pick<User, keyof UserToUserTable> &
    Partial<{ [key: string]: any }>)[];
  roster: Pick<Roster, 'month' | 'year' | 'id'>;
  workDays: WorkDay[];
  errors?: ErrorTypes;
}) {
  const { toast } = useToast();

  if (!shifts.length || shifts.length === 0) {
    return (
      <>
        <div>
          <p>Nenhum Turno Foi cadastrado ainda</p>
        </div>
      </>
    );
  }
  if (!users.length || users.length === 0) {
    return (
      <>
        <div>
          <p>Nenhum Usuário Foi cadastrado ainda</p>
        </div>
      </>
    );
  }

  if (!roster) {
    return (
      <>
        <div>
          <p>Essa Escala não Foi cadastrada ainda</p>
        </div>
      </>
    );
  }

  const WorkDaysColumn = createWorkDaysColumn(roster);
  const counterShiftsPerday = shifts.map((shift) => {
    const shiftPerDay = WorkDaysColumn.map((workdayObject) => {
      const { day, isWeekend } = workdayObject;
      return {
        cellData: workDays
          .filter(
            (workDay) =>
              workDay.shiftsId.includes(shift.id) &&
              workDay.day.getDate() === day &&
              workDay.day.getMonth() === getMonthFromRosterInNumber(roster)
          )
          .reduce((acc, curr) => {
            return acc + 1;
          }, 0),
        isWeekend
      };
    });
    return {
      shift,
      days: [...shiftPerDay]
    };
  });
  const counterShiftsPerdayHeadings = ['Turno', ...WorkDaysColumn];

  useEffect(() => {
    if (errors) {
      toast({
        title: 'Erro ou Aviso',
        description: errors.message
      });
    }
  }, []);

  return (
    <Table>
      <TableHeaderSticky>
        {counterShiftsPerdayHeadings.map((heading, i) => {
          return (
            <TableCell
            className={ typeof heading === 'string' ?"text-center w-20 first:sticky first:left-0 first:bg-muted/80 first:border-r-transparent" : ""}
              variant={
                typeof heading === 'string'
                  ? undefined
                  : heading.isWeekend === true
                    ? 'isWeekend'
                    : undefined
              }
              key={generateUniqueKey()}
            >
              {typeof heading === 'string' ? heading : heading.day}
            </TableCell>
          );
        })}
      </TableHeaderSticky>

      <TableBody>
        {counterShiftsPerday.map((rowData, i) => {
          const { shift, days } = rowData;
          return (
            <TableRow key={generateUniqueKey()} >
              <TableCell 
                  className='first:sticky first:left-0 first:bg-muted/80 first:border-r-transparent'
              
              >{shift.name}</TableCell>
              {days.map((day, i) => {
                return (
                  <TableCell
                    key={generateUniqueKey()}
                    variant={handleCellColor(shift, day)}
                  >
                    {day.cellData}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
