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
} from '@/src/lib/utils';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { useToast } from '../ui/use-toast';
import {  Download, Pen } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { TableHeaderSticky } from './TableHeaderSticky';
import { Search } from '../search';
import { downloadCSV } from '@/src/app/action';

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
  const router = useRouter();
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
      const newDate = day.day;
      const isWeekend = day.isWeekend;
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
      return {shiftInThisDay,
        isWeekend
      };
    });
    return {
      user,
      days: [...shiftPerDay]
    };
  });
  const counterShiftsPerdayHeadings = [
    'Usuário',
    ...WorkDaysColumn
  ];

  async function handleDownloadCSV() {
    const resultFromDownloadCSV = await downloadCSV(counterShiftsPerdayHeadings.map(day=>{
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
    }), `escala-${roster.id}.csv`);
    if(resultFromDownloadCSV.code === 200){
      const dateFromRoster = getDateFromRoster(roster)
      const filename = `escala-${dateFromRoster.getMonth()}-${dateFromRoster.getFullYear()}.csv`;
      const csvContent = resultFromDownloadCSV.data;
      if(!csvContent){
        toast({
          title: 'Erro',
          description: 'Erro ao baixar arquivo',
        });
        return
      }
      const blob = new Blob([csvContent?.csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
    
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: 'Sucesso',
        description: 'Arquivo baixado com sucesso',
      });

  }else{
    toast({
      title: 'Erro',
      description: resultFromDownloadCSV.message,
    });
  }
  }

  return (
    <div className='flex flex-col gap-2'>
    <div className="mt-4 grid grid-cols-[1fr_50px] gap-5 w-full">
            <Search value={search} />
              <Button variant={"ghost"}>
                <Download size={24} onClick={handleDownloadCSV}/>
              </Button>
              </div>
    <Table
    >
      <TableHeaderSticky>
          {counterShiftsPerdayHeadings.map((heading, i) => {
            return (
             <TableCell 
             className={ typeof heading === 'string' ?"text-center w-20 first:sticky first:left-0 first:bg-muted/80 first:border-r-transparent" : ""}
             variant={typeof heading === "string" ? undefined : heading.isWeekend === true? "isWeekend" : undefined} key={generateUniqueKey()}>{typeof heading === "string" ? heading : heading.day}</TableCell>

            );
          })}
      </TableHeaderSticky>
      <TableBody >
        {counterUsersPerday.map((userShifts) => {
          const { user, days } = userShifts;
          return (
            <TableRow key={generateUniqueKey()} className='first:sticky first:left-0 first:bg-muted/80 first:border-r-transparent'>
              <TableCell className="text-center w-20 first:sticky first:left-0 first:bg-muted/80 first:border-r-transparent">
                <div className='flex flex-col gap-2'>
                <div className='grid grid-cols-[1fr_20px] text-center items-center'>
                  <div className='text-center'>
                  {user.name}
                </div>
                  <div>
                  <Button variant={"ghost"} size={"icon"}
                  onClick={() => {
                    router.push(`/lancamento?userEmail=${user.email}&rosterId=${roster.id}`)
                  }}
                  >
                      <Pen size={10}/>
                  </Button>
                  
                </div>
                </div>
                </div>
                
                </TableCell>
              {days.map((cellData, i) => {
                return (
                  <TableCell variant={typeof cellData === "string" ? undefined : cellData.isWeekend === true? "isWeekend" : undefined} key={generateUniqueKey()}>{typeof cellData === "string" ? cellData : cellData.shiftInThisDay}</TableCell>

                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}
