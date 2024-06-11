'use client';


import { useRouter } from 'next/navigation';
import { generateUniqueKey } from 'lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export function CustomTable({
  values,
  offset
}: {
  values: any[];
  offset: number;
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
        <div className=' '>
          <Table className="overflow-auto max-h-dvh" >
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
        <div className='flex gap-4'>
          
        <Button
          className="mt-4 w-40"
          variant="secondary"
          onClick={() => onClick()}
          >
          Próxima Página
        </Button>
        <Button
          className="mt-4 w-40"
          variant="secondary"
          onClick={() => offset >= values.length? router.replace(`/?offset=${10}`) : router.replace(`/?offset=${values.length}`)}
          >
          {offset >= values.length? "Comprimir tudo" : "Carregar tudo"}
        </Button>
          </div>
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


