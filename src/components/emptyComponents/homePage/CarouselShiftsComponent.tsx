import {  getMonthFromRoster } from '@/src/lib/utils';
import { ShiftsTable } from '../../tables/shiftsTable';

import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { Roster, Shift, User, WorkDay } from '@prisma/client';

type CarrouselComponentProps = {
  roster: Roster | null;
  shifts: Shift[];
  workDays: WorkDay[];
  users: User[];
};

export function CarouselShiftsComponent({
  roster,
  shifts,
  workDays,
  users,
}: CarrouselComponentProps) {
  return (
    <>
    {
      shifts.length === 0 || !roster
      ?
      null
      :

      <ScrollArea   className='max-h-[dvh] w-full overflow-auto'>
                <ShiftsTable
                  shifts={shifts}
                  users={users}
                  roster={roster}
                  workDays={workDays}
                />
              <ScrollBar  orientation='horizontal'/>
              </ScrollArea>

    }
      </>
    )
}
