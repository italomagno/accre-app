'use client';

import {
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/src/components/ui/table';
import { createWorkDaysColumn, generateUniqueKey, handleCellColor } from '@/src/lib/utils';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { ErrorTypes } from '@/src/types';
import { useEffect } from 'react';
import { useToast } from '../ui/use-toast';


type UserToUserTable = {
  id:string,
  name:string
}
export function ShiftsTable({
  shifts,
  users,
  roster,
  workDays,
  errors,
}: {
  shifts:(Pick<Shift,"id" | "name" | "quantity"> & Partial<{[key:string]:any}>)[],
  users: (Pick<User,keyof UserToUserTable> & Partial<{[key:string]:any}>)[],
  roster: Pick<Roster,"month" | "year" | "id">,
  workDays: WorkDay[]
  errors?: ErrorTypes
}) {
  const {toast} = useToast()
  const rosterId = roster.id

  if(!shifts.length || shifts.length === 0){
    return (
      <>
      <div><p>Nenhum Turno Foi cadastrado ainda</p></div>
    </>
  )
  }
  if(!users.length || users.length === 0){
    return (
      <>
      <div><p>Nenhum Usuário Foi cadastrado ainda</p></div>
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
  const counterShiftsPerday = shifts.map(shift => {
  const shiftPerDay = WorkDaysColumn.map(day => {
      return workDays.filter(workDay => workDay.shiftsId.includes(shift.id) && workDay.day.getDate() === day).reduce((acc,curr) => {
        return acc + 1
      }
      ,0)
    })
    return {
      shift,
      days: [...shiftPerDay]
    }
  })
  const counterShiftsPerdayHeadings = ["Turno",...WorkDaysColumn.map(day => day.toString())]


 useEffect(() => {
    if(errors){
      toast({
        title: "Erro ou Aviso",
        description: errors.message
      })
    }
  }
  ,[])

  return (
    <Table>

            <TableHeader className='sticky top-0 -z-20 w-fit'>
              <TableRow>
              {
                counterShiftsPerdayHeadings.map((heading,i) => {
                  return <TableCell key={generateUniqueKey()}>{heading}</TableCell>
                })
              }
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                counterShiftsPerday.map((rowData,i) => {
                  const {shift,days} = rowData
                  return (
                    <TableRow key={generateUniqueKey()}>
                      <TableCell>{shift.name}</TableCell>
                      {
                        days.map((day,i) => {
                          return <TableCell key={generateUniqueKey()} variant={handleCellColor(shift,day)}>{day}</TableCell>
                        
                        })
                      }
                    </TableRow>
                  )
                })
              }
            </TableBody>
    </Table>


 
  );
}




