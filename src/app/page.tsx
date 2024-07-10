import { LayoutComponent } from './LayoutComponent';

import { handleFechDataToShiftsTable } from './action';
import { EmptyHomePageComponent } from '../components/emptyComponents/homePage/EmptyHomePageComponent';
import { CarouselGeralUserComponent } from '../components/emptyComponents/homePage/CarouselGeralUserComponent';
import { CarouselShiftsComponent } from '../components/emptyComponents/homePage/CarouselShiftsComponent';
import { getUserByEmail } from './login/_actions';
import { auth } from '../lib/auth';
import { CarouselAdminUserComponent } from '../components/emptyComponents/homePage/CarouselAdminUserComponent';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? "";
  const result = await handleFechDataToShiftsTable();
  if ("code" in result) {
    return (
      <EmptyHomePageComponent
        toast={result}
      />
    );
  }
  const { rosters, shifts, WorkDays, users } = result;

  const session = await auth()
  if(!session) return null
  const user =  session && await getUserByEmail(session.user.email)
  if("code" in user) return null

  
  return (
    <LayoutComponent>
        <main className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 mt-14 gap-32 px-14">
          {
          <>
            <CarouselShiftsComponent
            rosters={rosters}
            shifts={shifts}
            workDays={WorkDays}
            users={users}
            />
            {
              user.role === "ADMIN" 
              ?
              <CarouselAdminUserComponent
              rosters={rosters}
            search={search}
            shifts={shifts}
            workDays={WorkDays}
            users={users}
              />
              :
              <CarouselGeralUserComponent 
            rosters={rosters}
            search={search}
            shifts={shifts}
            workDays={WorkDays}
            users={users}
            />
            }
            
          </>

          }
        
    
        </main>
    </LayoutComponent>
  );
}
