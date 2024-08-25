'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/src/components/ui/table';
import {
  createWorkDaysColumn,
  generateUniqueKey,
  getDateFromRoster,
  getMonthFromRosterInNumber
} from '@/src/lib/utils';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { useToast } from '../ui/use-toast';
import { handleisSameDate } from '@/src/lib/date';
import { TableHeaderSticky } from './TableHeaderSticky';
type UserToUserTable = {
  id: string;
  name: string;
};
export function GeralUserShiftTable({
  shifts,
  users: usersWithoutFilter,
  roster,
  workDays,
  search
}: {
  shifts: (Shift & Partial<{ [key: string]: any }>)[];
  users: (User & Partial<{ [key: string]: any }>)[];
  roster: Pick<Roster, 'month' | 'year' | 'id'>;
  workDays: WorkDay[];
  search: string;
}) {
  const users = usersWithoutFilter.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
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
  if (!usersWithoutFilter.length || usersWithoutFilter.length === 0) {
    return (
      <>
        <div>
          <p>Nenhum Usuário Foi cadastrado ainda</p>
        </div>
      </>
    );
  }
  if (!users.length || users.length === 0) {
    return (
      <>
        <div>
          <p>Nenhum Usuário encontrado</p>
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
  const dateFromRoster = getDateFromRoster(roster);
  const counterUsersPerday = users.map((user) => {
    const shiftPerDay = WorkDaysColumn.map((workdayFromDayColumn) => {
      const { day, isWeekend } = workdayFromDayColumn;
      const newDate = new Date(
        dateFromRoster.getFullYear(),
        dateFromRoster.getMonth(),
        day
      );
      const workDay = workDays.filter(w=> w.userId === user.id && w.day.getMonth() === getMonthFromRosterInNumber(roster) && w.day.getFullYear() === roster.year ).find(
        (workDay) =>
           workDay.day.getDate() === newDate.getDate()  
      );
      const shiftsInThisWorkDay =
        workDay?.shiftsId.flatMap((shiftId) =>
          shifts.filter((shift) => shift.id === shiftId)
        ) || [];
      const shiftInThisDay =
        shiftsInThisWorkDay.length > 0
          ? shiftsInThisWorkDay.map((shift) => shift.name).join(' | ')
          : '-';
      if (!workDay) return '-';
      return { shiftInThisDay, isWeekend };
    });
    return {
      user,
      days: [...shiftPerDay]
    };
  });
  const counterShiftsPerdayHeadings = ['Usuário', ...WorkDaysColumn];

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
        {counterUsersPerday.map((userShifts) => {
          const { user, days } = userShifts;
          return (
            <TableRow key={generateUniqueKey()} className='first:sticky first:left-0 first:bg-muted/80 first:border-r-transparent'>
                      <TableCell className="text-center w-20 first:sticky first:left-0 first:bg-muted/80 first:border-r-transparent">
                {user.name}</TableCell>
              {days.map((cellData, i) => {
                return (
                  <TableCell
                    variant={
                      typeof cellData === 'string'
                        ? undefined
                        : cellData.isWeekend === true
                          ? 'isWeekend'
                          : undefined
                    }
                    key={generateUniqueKey()}
                  >
                    {typeof cellData === 'string'
                      ? cellData
                      : cellData.shiftInThisDay}
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
