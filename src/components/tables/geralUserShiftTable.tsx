'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/src/components/ui/table';
import { createWorkDaysColumn, generateUniqueKey, getDateFromRoster } from '@/src/lib/utils';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { useToast } from '../ui/use-toast';
import { handleisSameDate } from '@/src/lib/date';
type UserToUserTable = {
  id:string,
  name:string
}
export function GeralUserShiftTable({
  shifts,
  users:usersWithoutFilter,
  roster,
  workDays,
  search,
}: {
  shifts:(Shift & Partial<{[key:string]:any}>)[],
  users: (User & Partial<{[key:string]:any}>)[],
  roster: Pick<Roster,"month" | "year" | "id">,
  workDays: WorkDay[]
  search: string
}) {
  const users = usersWithoutFilter.filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
  const {toast} = useToast()

  if(!shifts.length || shifts.length === 0){
    return (
      <>
      <div><p>Nenhum Turno Foi cadastrado ainda</p></div>
    </>
  )
  }
  if(!usersWithoutFilter.length || usersWithoutFilter.length === 0){
    return (
      <>
      <div><p>Nenhum Usuário Foi cadastrado ainda</p></div>
      </>
  )
  }
  if(!users.length || users.length === 0){
    return (
      <>
      <div><p>Nenhum Usuário encontrado</p></div>

      </>
  )
  }

  if(!roster){
    return (
      <>
      <div><p>Essa Escala não Foi cadastrada ainda</p></div>

      </>
    )
  }

  const WorkDaysColumn = createWorkDaysColumn(roster)
  const dateFromRoster = getDateFromRoster(roster)
  const counterUsersPerday = users.map(user => {
  const shiftPerDay = WorkDaysColumn.map(day => {
    const newDate = new Date(dateFromRoster.getFullYear(),dateFromRoster.getMonth(),day)
    const workDay = workDays.find(workDay => workDay.userId.includes(user.id) && handleisSameDate(workDay.day,newDate))
    const shiftsInThisWorkDay = workDay?.shiftsId.flatMap(shiftId => shifts.filter(shift => shift.id === shiftId)) || [];
    const shiftInThisDay = shiftsInThisWorkDay.length > 0 ? shiftsInThisWorkDay.map(shift => shift.name).join(" | ") : "-";
    if(!workDay) return "-"
    return shiftInThisDay
    })
    return {
      user,
      days: [...shiftPerDay]
    }
  })
  const counterShiftsPerdayHeadings  = ["Usuário",...WorkDaysColumn.map(day => day.toString())]

  return (
    <Table>
      <TableHeader className='sticky top-0 w-fit'>
        <TableRow>
          {counterShiftsPerdayHeadings.map((heading, i) => {
            return <TableCell key={generateUniqueKey()}>{heading}</TableCell>;
          })}
        </TableRow>
      </TableHeader>
      <TableBody >
        {counterUsersPerday.map((userShifts) => {
          const { user, days } = userShifts;
          return (
            <TableRow key={generateUniqueKey()}>
              <TableCell >{user.name}</TableCell>
              {days.map((cellData, i) => {
                return <TableCell key={generateUniqueKey()}>{<p className="w-24">{cellData}</p>}</TableCell>;
              })} 
            </TableRow>
          );
        })}
      </TableBody>
    </Table>

  );
}



