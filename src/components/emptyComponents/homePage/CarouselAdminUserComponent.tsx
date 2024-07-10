import { generateUniqueKey, getMonthFromRoster } from '@/src/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '../../ui/carousel';
import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { Search } from '../../search';

import { GeralUserAdminShiftTable } from '../../tables/geralUserAdminShiftTable';

type CarrouselComponentProps = {
  rosters: Roster[];
  search: string;
  shifts: Shift[];
  workDays: WorkDay[];
  users: User[];
};

export function CarouselAdminUserComponent({
  rosters,
  shifts,
  workDays,
  users,
  search
}: CarrouselComponentProps) {
  return (
    <>
    {
      users.length === 0
      ?
      null
      :
      
      <Carousel className="w-96 mx-auto lg:mx-0 lg:w-full">
      <CarouselContent className="">
        {rosters.map((roster) => {
          return (
            <ScrollArea  key={generateUniqueKey()} className='max-h-[dvh] w-full overflow-auto'>
            <CarouselItem  className='w-fit h-fit'>
              <div className="mt-4 flex flex-col gap-4">
                <p>{`Escala geral do mês de ${getMonthFromRoster(roster)}`}</p>
                <Search value={search} />
              </div>
                <GeralUserAdminShiftTable
                  search={search}
                  roster={roster}
                  shifts={shifts}
                  users={users}
                  workDays={workDays}
                />

              <ScrollBar  orientation='horizontal'/>
            </CarouselItem>
            </ScrollArea>

          );
        })}
      </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
    }
  
    </>
  );
}
