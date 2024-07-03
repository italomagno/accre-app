import { LayoutComponent } from './LayoutComponent';

import { handleFechDataToShiftsTable } from './action';
import { EmptyHomePageComponent } from '../components/emptyComponents/homePage/EmptyHomePageComponent';
import { CarouselGeralUserComponent } from '../components/emptyComponents/homePage/CarouselGeralUserComponent';
import { CarouselShiftsComponent } from '../components/emptyComponents/homePage/CarouselShiftsComponent';

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

  
  return (
    <LayoutComponent>
        <main className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 mt-14 px-14">
        <CarouselShiftsComponent
        rosters={rosters}
        shifts={shifts}
        workDays={WorkDays}
        users={users}
        />
        
        <CarouselGeralUserComponent 
        rosters={rosters}
        search={search}
        shifts={shifts}
        workDays={WorkDays}
        users={users}
        />
    
        </main>
    </LayoutComponent>
  );
}
