
import { Roster, Shift, User, WorkDay } from '@prisma/client';


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
      
      
              
              <GeralUserAdminShiftTable
                search={search}
                roster={roster}
                shifts={shifts}
                users={users}
                workDays={workDays} />
        


    }
  
    </>
  );
}
