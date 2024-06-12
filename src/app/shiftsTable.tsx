'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { generateUniqueKey } from '@/src/lib/utils';

export function ShiftsTable({
  values,
  offset,
  valuesWithColors
}: {
  values: any[];
  valuesWithColors: any[];
  offset: number | null;
}) {
  const router = useRouter();
  function onClick() {
    router.replace(`/?offset=${offset}`);
  }

  const keys = Object.keys(values[0]);
  const hasName = keys.map(key=>key.toLocaleLowerCase()).includes('turno');

  const hasNumber = keys.some(key=>!isNaN(parseFloat(key)))


  return (
    <>
      <form className="border shadow-sm rounded-lg">
        <div className='max-h-dvh overflow-auto'>
          <Table >
            <TableHeader>
              <TableRow>
                
                {
                  hasName  && hasNumber && <TableHead className="max-w-[150px]">
                    Turno
                  </TableHead>
                }
                {
                  hasName  && hasNumber && <TableHead className="max-w-[150px]">
                    Quantidade
                  </TableHead>
                }
          
                {
                hasName && hasNumber?
                keys.filter(key=>!isNaN(parseFloat(key.toLocaleLowerCase()))).map((key, i) => (
                  <TableHead key={`${generateUniqueKey()}-component-th-${i}`} className="max-w-[150px]">
                    {Number(key)+1}
                  </TableHead>
                ))
                :
                keys.map((key, i) => (
                  <TableHead key={`${generateUniqueKey()}-component-th-${i}`} className="max-w-[150px]">
                    {String(key)}
                  </TableHead>
                ))
              }
              </TableRow>
            </TableHeader>
            <TableBody >
              {values.map((shift,i) => {
                return <UserRow key={generateUniqueKey()}  shifts={valuesWithColors[i]} hasName={hasName} hasNumber={hasNumber} />
              })}
            </TableBody>
          </Table>
        </div>
      </form>

    </>
  );
}
interface shiftProps {
  shifts: {
    //@ts-ignore
    turno?:string,
    //@ts-ignore
    quantidade?:string
    [key: string]: { value: number; color: string };
  };
  hasName: boolean;
  hasNumber: boolean;
}

function UserRow({ hasName, hasNumber, shifts }: shiftProps) {
  return (
    <TableRow>
      {hasName && hasNumber && (
        <TableCell className="max-w-[150px]">
          {shifts.turno}
        </TableCell>
      )}
      {hasName && hasNumber && (
        <TableCell className="max-w-[150px]">
          {shifts.quantidade}
        </TableCell>
      )}

      {hasName && hasNumber
        ? Object.keys(shifts)
            .filter((key) => !isNaN(parseFloat(key)))
            .slice(0, -1)
            .map((key, i) => {
              return (
                <TableCell
                  key={`${generateUniqueKey()}-component-td-${i}`}
                  className={`max-w-[150px]`}
                  variant={shifts[key].color as "lessThanNecessary" | "moreThanNecessary" | "hasNecessary" | undefined}
                >
                  {shifts[key].value || 0}
                </TableCell>
              );
            })
        : Object.keys(shifts).map((key, i) => (
            <TableCell
              key={`${generateUniqueKey()}-component-td-${i}`}
              className="max-w-[150px]"
            >
              {shifts[key].value || 0}
            </TableCell>
          ))}
    </TableRow>
  );
}


