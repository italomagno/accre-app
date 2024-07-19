import { generateUniqueKey, getMonthFromRoster } from '@/src/lib/utils';

import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { Search } from '../../search';

import { GeralUserAdminShiftTable } from '../../tables/geralUserAdminShiftTable';

type CarrouselComponentProps = {
  roster: Roster | null;
  search: string;
  shifts: Shift[];
  workDays: WorkDay[];
  users: User[];
};

export function CarouselAdminUserComponent({
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
      
      
              <div className='flex flex-col gap-2'>
              <div className="mt-4 flex flex-col gap-4">
            <Search value={search} />
          </div>
              <GeralUserAdminShiftTable
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
