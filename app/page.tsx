
import { getShiftsCounter, getShiftsMil } from 'lib/db';
import { Search } from './search';
import { CustomTable } from './customTable';
import { ShiftsTable } from './shiftsTable';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
 
  const {shifts:oldShifts,newOffset} = await getShiftsMil(search, Number(offset))
  const shifts = oldShifts.map((shift: any) => {
    const keys = Object.keys(shift)
    const obj:{[x:string]:string|number} = {};
    keys.forEach((key) => {
      obj[key] = shift[key] ?? '-';
    });
    delete obj["saram"]
    const newObj = {...obj,name:obj['name']
    }
    return newObj;
  });
  const {vectorToReturn:counter, vectorToReturnWithColors} = await getShiftsCounter()


  return (
    <main>
       <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Turnos</h1>
      </div>
        <ShiftsTable values={counter} valuesWithColors={vectorToReturnWithColors} offset={100} />
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Escala geral de Julho</h1>
      </div>
      <div className="w-full mb-4">
        <Search value={searchParams.q} />
      </div>
      <CustomTable values={shifts} offset={newOffset} />
      </div>
     
      
    </main>
  );
}
