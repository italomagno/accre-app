import { generateUniqueKey, getMonthFromRoster } from '@/src/lib/utils';

import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
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
            <ScrollArea  key={generateUniqueKey()} className='max-h-[300px] w-full overflow-auto'>
              <div className="mt-4 flex flex-col gap-4">
                <p>{`Escala geral do mês de ${getMonthFromRoster(roster)}`}</p>
                <Search value={search} />
              </div>
                <GeralUserShiftTable
                  search={search}
                  roster={roster}
                  shifts={shifts}
                  users={users}
                  workDays={workDays}
                />

              <ScrollBar  orientation='horizontal'/>
            </ScrollArea>

    }
  
    </>
  );
}
