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
} from '@/src/lib/utils';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { useToast } from '../ui/use-toast';
import { UpdateWorkDayCell } from './UpdateWorkDayCell';
import { Ghost, Pen } from 'lucide-react';
import { Button } from '../ui/button';

export function GeralUserAdminShiftTable({
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
  const counterUsersPerday = users.map((user) => {
    const shiftPerDay = WorkDaysColumn.map((day) => {
      const newDate = day;
      const workDay = workDays.find(
        (workDay) =>
          workDay.userId === user.id && workDay.day.getDate() === newDate
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
      return shiftInThisDay;
    });
    return {
      user,
      days: [...shiftPerDay]
    };
  });
  const counterShiftsPerdayHeadings = [
    'Usuário',
    ...WorkDaysColumn.map((day) => day.toString())
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {counterShiftsPerdayHeadings.map((heading, i) => {
            return (
              <TableHead className="text-center" key={generateUniqueKey()}>
                {heading}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {counterUsersPerday.map((userShifts) => {
          const { user, days } = userShifts;
          return (
            <TableRow key={generateUniqueKey()}>
              <TableCell className="text-center w-20">
                <div className='flex flex-col gap-2'>
                <div className='grid grid-cols-[1fr_20px] text-center items-center'>
                  <div className='text-center'>
                  {user.name}
                </div>
                  <div>
                  <Button variant={"ghost"} size={"icon"}>
                  <Pen size={10}/>
                  </Button>
                  
                </div>
                </div>
                
                </div>
                
                </TableCell>
              {days.map((cellData, i) => {
                return (
                  <TableCell key={generateUniqueKey()}>{cellData}</TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
