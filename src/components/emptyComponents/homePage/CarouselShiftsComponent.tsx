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
import { ResizableHandle, ResizablePanelGroup } from '../../ui/resizable';

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
    {
      shifts.length === 0
      ?
      null
      :

      <Carousel className="w-96 mx-auto lg:mx-0 lg:w-full  max-h-96"
      >
        <CarouselContent className="">
          {rosters.map((roster) => {
            return (
              <ScrollArea key={generateUniqueKey()}  className='max-h-[dvh] w-full overflow-auto'>
                 <div className='ml-4'>
            {`Turnos do mês de ${getMonthFromRoster(roster)}`}
                </div>
              <CarouselItem className='mt-5'>
             

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

    }
    
   
      </>
  );
}
