
import { getShifts } from 'lib/db';
import { Search } from './search';
import { CustomTable } from './users-table';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
 
  const {shifts:oldShifts,newOffset} = await getShifts(search, Number(offset))
  const shifts = oldShifts.map((shift: any) => {
    const keys = Object.keys(shift).sort((a, b) => {
      if (isNaN(Number(a)) && !isNaN(Number(b))) {
      return -1; // a is a letter, b is a number
      } else if (!isNaN(Number(a)) && isNaN(Number(b))) {
      return 1; // a is a number, b is a letter
      } else {
      return a.localeCompare(b); // both are either letters or numbers
      }
    });
    const obj = {};
    keys.forEach((key) => {
      //@ts-ignore
      obj[key] = shift[key] ?? '-';
    });
    return obj;
  });

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Militares</h1>
      </div>
      <div className="w-full mb-4">
        <Search value={searchParams.q} />
      </div>
      <CustomTable values={shifts} offset={newOffset} />
    </main>
  );
}
