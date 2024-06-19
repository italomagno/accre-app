/* 
import { getShiftsCounter, getShiftsMil } from '@/src/lib/db/googleSheets'; */
import { Search } from './search';
import { CustomTable } from '../components/tables/customTable';
import { ShiftsTable } from '../components/tables/shiftsTable';
import { LayoutComponent } from './LayoutComponent';
import { SkeletonTable } from '../components/tables/SkeletonTable';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
/*   const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 10;
 
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

 */
const values = null
const month = null
const emptyVectorToReturnWithColors: any[] = []

    return (
      <LayoutComponent>
    <main className='flex flex-col p-4 md:p-6'>
       <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Turnos</h1>
      </div>
      <div className='overflow-x-auto'>
        {
          values? 
          <ShiftsTable values={values} valuesWithColors={emptyVectorToReturnWithColors} offset={100} />
          :
          <SkeletonTable/>
          
        }
      </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-6 sw-screen">
        <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">{`Escala geral de ${month? month : ""}`}</h1>
      </div>
      {
        values?
        <>
        <div className="w-full mb-4">
                  <Search value={searchParams.q} />
                </div><div className='w-screen'>

                    <CustomTable values={values} offset={0} />
                  </div>
                  </>
      :
      <SkeletonTable/>
      


      }
      
      </div>
    </main>
    </LayoutComponent>

  );
}
