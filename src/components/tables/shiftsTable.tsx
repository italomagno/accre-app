'use client';

import {
  TableRow,
  TableCell,
  TableBody,
  Table
} from '@/src/components/ui/table';
import {
  createWorkDaysColumn,
  generateUniqueKey,
  getMonthFromRosterInNumber,
  handleCellColor,
  transformToVector
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
  const counterUsersPerday = users.map((user) => {
    const shiftPerDay = WorkDaysColumn.map((day) => {
      const newDate = day.day;
      const isWeekend = day.isWeekend;
      const workDay = workDays.find(
        (workDay) =>
          workDay.userId === user.id && workDay.day.getDate() === newDate && workDay.day.getMonth() === getMonthFromRosterInNumber(roster) && workDay.day.getFullYear() === roster.year
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
      return {shiftInThisDay,
        isWeekend
      };
    });
    return {
      user,
      days: [...shiftPerDay]
    };
  });
  const counterUserPerDayHeading = [
    'Usuário',
    ...WorkDaysColumn
  ];

    const resultFromDownloadCSV = transformToVector(counterUserPerDayHeading.map(day=>{
      if(typeof day === 'string'){
        return day
      }
      return String(day.day)
    }), counterUsersPerday.map(row=>{

      return [row.user.name, ...row.days.map(day=>{
        if(typeof day === 'string'){
          return day
        }
        return day.shiftInThisDay
      })]
    }));
  const counterShiftsPerday = shifts.map((shift) => {

    
    const shiftPerDay = WorkDaysColumn.map((workdayObject) => {
      const { day, isWeekend } = workdayObject;

      const columnOfShifts:string[] = resultFromDownloadCSV.map(row=>{
        const cellData = row[day];
        const hasVerticalBar = cellData.includes('|');
        if(hasVerticalBar){
          const shifts = cellData.split(' | ');
          return shifts
        }
        return [cellData]
      })

      return {
        day,
        cellData: columnOfShifts
          .filter(
            (workDay) =>
              workDay.includes(shift.name) || workDay.includes(shift.id)
          ).length,
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


/* 

[{"id":"66a269614fd5b45837077711","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074bb","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a269647e3cba6327a03c8e","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074bb","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a566e6649c40e4477fd3fd","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074a6","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a566ec649c40e4477fd401","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074a6","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a566f5649c40e4477fd405","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074a6","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a56e0f649c40e4477fd414","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac296390748d","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a59f81e8db5a70c1264b3b","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b1","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a59fb1e8db5a70c1264b3e","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b1","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a59fb3149b67ffae11463a","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b1","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a59fb6061742479c65f84c","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b1","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a5b509afbdc4189b66c2e9","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074e5","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a665e7701535e01f5ec5e0","day":"2024-09-30T03:00:00.000Z","userId":"66a64786f347e3479e4f31de","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a66803701535e01f5ec5ea","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074ac","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7a20ebed0cbc66fab4921","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b9","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7a2100fcd82b4e2591a5a","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b9","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7a213cf2bedb20277920d","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b9","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7a214bed0cbc66fab4924","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b9","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7a4bbcf2bedb202779211","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b9","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7a4e3cf2bedb202779214","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b9","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7a4e74552edf6d375e854","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b9","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7a4e8cf2bedb202779217","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074b9","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7af7bbab1b83f5df8fceb","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac296390749d","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7af88bab1b83f5df8fcef","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac296390749d","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a7f205cdd6e8f553b4345b","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074c5","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a812f31f07ce19951473b5","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074cf","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a812f72b132eff853cb5a3","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074cf","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a844d4663a71dc0891f9a9","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074cb","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a844d7506144c317cf193f","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074cb","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a844d875ecb87c47f6b125","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074cb","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8459075ecb87c47f6b128","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074cb","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8459a75ecb87c47f6b12b","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074cb","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8459c506144c317cf1943","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074cb","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8cdf2dffb36c31e87d95b","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074d7","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8d54cc3b3f86c637f622e","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074d0","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8d558c3b3f86c637f6232","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074d0","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8d55a2219f36e0a6d39f7","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074d0","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8d5ac2219f36e0a6d39fb","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074d0","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8d5afc3b3f86c637f6236","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074d0","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a8d7d3506169c04a153928","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074f2","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a925ca37f0e353dd1342ec","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074f6","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a95278d627d31162ac522f","day":"2024-09-30T03:00:00.000Z","userId":"66a94f92e9efc0859684d03c","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a97b58fac2ce9f8907d7f5","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac296390750b","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a97b73fac2ce9f8907d7f9","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac296390750b","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a9828f688445141033b735","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074e1","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"},{"id":"66a98378aca5fd25a42de8da","day":"2024-09-30T03:00:00.000Z","userId":"669aa85a31e6ac29639074ea","rosterId":"669ae092ec3bf9a44c96f294","shiftsId":["669adacd49dce4d895f7c3b2","669adc1749dce4d895f7c3be"],"departmentId":"669a64df92852f59df58fe00"}]
*/