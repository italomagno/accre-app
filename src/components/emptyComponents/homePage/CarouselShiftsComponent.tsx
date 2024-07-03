import { generateUniqueKey, getMonthFromRoster } from '@/src/lib/utils';
import { ShiftsTable } from '../../tables/shiftsTable';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '../../ui/carousel';
import { ScrollArea, ScrollBar } from '../../ui/scroll-area';
import { Roster, Shift, User, WorkDay } from '@prisma/client';

type CarrouselComponentProps = {
  rosters: Roster[];
  shifts: Shift[];
  workDays: WorkDay[];
  users: User[];
};

export function CarouselShiftsComponent({
  rosters,
  shifts,
  workDays,
  users,
}: CarrouselComponentProps) {
  return (
    <>
    <Carousel className="w-96 mx-auto lg:mx-0 lg:w-full lg:max-w-md max-h-96">
        <CarouselContent className="">
          {rosters.map((roster) => {
            return (
              <ScrollArea className='max-h-96 w-full overflow-auto'>
                 <div className='ml-4'>
            {`Turnos do mês de ${getMonthFromRoster(roster)}`}
                </div>
              <CarouselItem key={generateUniqueKey()} className='mt-5'>
             

                <ShiftsTable
                  shifts={shifts}
                  users={users}
                  roster={roster}
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
   
      </>
  );
}
