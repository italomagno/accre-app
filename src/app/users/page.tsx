import { CustomTable } from '../customTable';
import { Search } from '../search';
import { getUsers } from '@/src/lib/db/sheets/googleSheetsDataSource';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
 
  const {users,newOffset:oldOffset} = await getUsers(search, Number(offset))
  const Offset = oldOffset ?? 10;
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Militares</h1>
      </div>
      <div className="w-full mb-4">
        <Search value={searchParams.q} />
      </div>
      <CustomTable values={users} offset={Offset} />
    </main>
  );
}
