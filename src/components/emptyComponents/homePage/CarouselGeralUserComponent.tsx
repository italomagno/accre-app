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
import { Search } from '../../search';
import { GeralUserShiftTable } from '../../tables/geralUserShiftTable';

type CarrouselComponentProps = {
  rosters: Roster[];
  search: string;
  shifts: Shift[];
  workDays: WorkDay[];
  users: User[];
};

export function CarouselGeralUserComponent({
  rosters,
  shifts,
  workDays,
  users,
  search
}: CarrouselComponentProps) {
  return (
    <>
    <Carousel className="w-96 mx-auto lg:mx-0 lg:w-full lg:max-w-md ">
        <CarouselContent className="">
          {rosters.map((roster) => {
            return (
              <ScrollArea  key={generateUniqueKey()} className='max-h-96 w-full overflow-auto'>
              <CarouselItem  className='w-fit h-fit'>
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
