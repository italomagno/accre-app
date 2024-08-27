import { LayoutComponent } from './LayoutComponent';
import { handleFechDataToShiftsTable } from './action';
import { EmptyHomePageComponent } from '../components/emptyComponents/homePage/EmptyHomePageComponent';
import { CarouselGeralUserComponent } from '../components/emptyComponents/homePage/CarouselGeralUserComponent';
import { getUserByEmail } from './login/_actions';
import { auth } from '../lib/auth';
import { CarouselAdminUserComponent } from '../components/emptyComponents/homePage/CarouselAdminUserComponent';
import { getMonthFromRoster, getMonthFromRosterInNumber } from '../lib/utils';
import { CarouselShiftsComponent } from '../components/emptyComponents/homePage/CarouselShiftsComponent';
import { CarouselDailyShiftsComponent } from '../components/tables/CarouselDailyShiftsComponent';
import { NavigateBetweenRostersButton } from '../components/tables/NavigateBetweenRostersButton';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; rosterMonth: string; rosterYear: string; day: string};
}) {
  const search = searchParams.q ?? "";
  const day = parseInt(searchParams.day ?? new Date().getDate()) ;

  const result = await handleFechDataToShiftsTable();
  if ("code" in result) {
    return (
      <EmptyHomePageComponent
        toast={result}
      />
    );
  }
  const session = await auth();
  if (!session) return null;
  const user = session && await getUserByEmail(session.user.email);
  if ("code" in user) return (
    
        <EmptyHomePageComponent
          toast={user}
        />
  )

  const { rosters, shifts, WorkDays, users } = result;
  
  const rosterMonth = parseInt(searchParams.rosterMonth);
  const rosterYear = parseInt(searchParams.rosterYear);
  if(rosters.length === 0) return (
    
        <EmptyHomePageComponent
          toast={{code: 404, message: "Não há escalas cadastradas ainda"}}
          
        />
  )

  
  if(shifts.length === 0) return (
    
        <EmptyHomePageComponent
          toast={{code: 404, message: "Não há turnos cadastrados ainda"}}
        />
  )

  const currentRoster = rosters.find(roster =>{ 
    return getMonthFromRosterInNumber(roster) === rosterMonth && roster.year === rosterYear}) ?? rosters[rosters.length-1]
    const workDaysByRoster = WorkDays.filter(workDay=>workDay.rosterId === currentRoster?.id)
const usersByRoster = users


  return (
    <LayoutComponent>
      <main>
        <>
          <div className='my-14 w-full flex items-center justify-between px-2 lg:px-7'>
            <NavigateBetweenRostersButton 
              rosters={rosters}
              type="left"
            />
            <div>
              <p className="text-lg">{currentRoster? `Escala do mês de ${getMonthFromRoster(currentRoster) ?? 'desconhecido'} de ${currentRoster.year}` : "Não há escalas cadastradas ainda"}</p>
            </div>
            <NavigateBetweenRostersButton 
              rosters={rosters}
              type="right"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-2 px-2 lg:px-14">
            <>
            <div className='grid grid-rows-subgrid'>

            <CarouselDailyShiftsComponent
            />
            </div>
            <div className='col-span-2'>
            <CarouselShiftsComponent
            roster={currentRoster}
            shifts={shifts}
            users={usersByRoster}
            workDays={workDaysByRoster} 
            />
            </div>
            <div></div>

              {
                user.role === "ADMIN" 
                  ? <>
                  <div className='col-span-2'>
                    <CarouselAdminUserComponent
                      roster={currentRoster}
                      search={search}
                      shifts={shifts}
                      workDays={workDaysByRoster}
                      users={usersByRoster}
                    />
                  </div>
                  </>

                  : 
                  <div className='col-span-2'>

                  <CarouselGeralUserComponent 
                      roster={currentRoster}
                      search={search}
                      shifts={shifts}
                      workDays={workDaysByRoster}
                      users={usersByRoster}
                    />
                  </div>
              }
            
            </>
          </div>
        </>
      </main>
    </LayoutComponent>
  );
}
