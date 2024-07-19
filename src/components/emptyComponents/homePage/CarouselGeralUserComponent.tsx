
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { Search } from '../../search';
import { GeralUserShiftTable } from '../../tables/geralUserShiftTable';

type CarrouselComponentProps = {
  roster: Roster | null;
  search: string;
  shifts: Shift[];
  workDays: WorkDay[];
  users: User[];
};

export function CarouselGeralUserComponent({
  roster,
  shifts,
  workDays,
  users,
  search
}: CarrouselComponentProps) {
  return (
    <>
    {
      users.length === 0 || !roster
      ?
      null
      :
      <div className='flex flex-col gap-2 w-full'>
      <div className="mt-4 flex flex-col gap-4">
            <Search value={search} />
          </div>
              <GeralUserShiftTable
              search={search}
              roster={roster}
              shifts={shifts}
              users={users}
              workDays={workDays} />
    </div>

    }
  
    </>
  );
}
