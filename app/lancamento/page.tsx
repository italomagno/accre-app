
import { CalendarComponent } from 'app/calendarComponent';
import { getUsers } from 'lib/db';

export default async function lancamento({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
 
  const {users,newOffset} = await getUsers(search, Number(offset)) 
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Lancamento</h1>
      </div>
      <div>
        <CalendarComponent />
      </div>
     
    </main>
  );
}
