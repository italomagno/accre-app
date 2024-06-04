'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from 'components/ui/table';
import { Button } from 'components/ui/button';
import { useRouter } from 'next/navigation';
import { generateUniqueKey } from 'lib/utils';

export function CustomTable({
  values,
  offset
}: {
  values: any[];
  offset: number | null;
}) {
  const router = useRouter();
  function onClick() {
    router.replace(`/?offset=${offset}`);
  }

  const keys = Object.keys(values[0]);
  const hasName = keys.map(key=>key.toLocaleLowerCase()).includes('name' || 'nome');
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
                    Nome
                  </TableHead>
                }
          
                {
                hasName && hasNumber?
                keys.filter(key=>key.toLocaleLowerCase() !== "name").map((key, i) => (
                  <TableHead key={`${generateUniqueKey()}-component-th-${i}`} className="max-w-[150px]">
                    {String(key)}
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
              {values.map((user) => (
                <UserRow key={generateUniqueKey()} user={user} hasName={hasName} hasNumber={hasNumber} />
              ))}
            </TableBody>
          </Table>
        </div>
      </form>

      {offset !== null && (
        <Button
          className="mt-4 w-40"
          variant="secondary"
          onClick={() => onClick()}
        >
          Next Page
        </Button>
      )}
    </>
  );
}
interface UserProps {
  user: {
    cpf: string;
    saram: string;
    name: string;
    email: string;
    block_changes: string;
    is_expediente: string;
    [key: string]: string;
  },
  hasName:boolean,
  hasNumber:boolean
}

function UserRow({ user,hasName ,hasNumber}:UserProps) {


  const userId = user.cpf;
  return (
    <TableRow>
      {
        hasName  && hasNumber && 
        <TableCell className="max-w-[150px]">
          {user.name || '-'}
        </TableCell>
      }

      {
      hasName && hasNumber? 
      Object.keys(user).filter(key => !isNaN(parseFloat(key))).map((key, i) => (
        <TableCell key={`${generateUniqueKey()}-component-td-${i}`} className="max-w-[150px]">
          {user[key] || '-'}
        </TableCell>
      ))
      :
      Object.keys(user).map((key, i) => (
        <TableCell key={`${generateUniqueKey()}-component-td-${i}`} className="max-w-[150px]">
          {user[key] || '-'}
        </TableCell>
      ))
      }
    </TableRow>
  );
}


