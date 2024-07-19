import { ShiftsTable } from '../../tables/shiftsTable';

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


                <ShiftsTable
                  shifts={shifts}
                  users={users}
                  roster={roster}
                  workDays={workDays}
                />


    }
      </>
    )
}
