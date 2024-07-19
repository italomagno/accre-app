'use client';
import { generateUniqueKey } from '@/src/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import React, { useEffect, useState } from 'react';
import { getShiftsFilteredPerDay } from '../update/shift/action';
import { useToast } from '../ui/use-toast';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { DatePickerDemo } from './datePickerDemo';

export function CarouselDailyShiftsComponent() {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>();

  const [shifts, setShifts] = useState<
    {
      Turno: string;
      Escalado: {
        name: string;
      }[];
    }[]
  >([]);

  async function getShifts() {
    const response = await getShiftsFilteredPerDay(date ?? new Date());

    if ('code' in response) {
      toast({
        title: 'Erro',
        description: response.message
      });
    } else {
      setShifts(response);
    }
  }

  useEffect(() => {
    getShifts();
  }, [date]);

  const headers = Object.keys(shifts[0] ?? {});

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <DatePickerDemo date={date} setDate={setDate} />
      <ScrollArea
        key={generateUniqueKey()}
        className="max-h-[dvh] w-full overflow-auto "
      >
        <Table>
          <TableCaption>
            {shifts.length <= 0
              ? `Ainda não há escalados para o dia ${date?.getDate() ?? new Date().getDate()}`
              : `Lista de escalados para o dia ${date?.getDate() ?? new Date().getDate()}`}
          </TableCaption>
          {shifts.length > 0 && (
            <>
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={generateUniqueKey()}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <React.Fragment key={generateUniqueKey()}>
                    {shift.Escalado.map((escalado) => (
                      <TableRow key={generateUniqueKey()}>
                        <TableCell>{shift.Turno}</TableCell>
                        <TableCell>{escalado.name}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </>
          )}
        </Table>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
