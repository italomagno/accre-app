

import { CalendarComponent } from '@/src/app/calendarComponent';
import { LayoutComponent } from '../LayoutComponent';
import { getRostersById, getRostersBySession } from '../settings/roster/actions';
import { getAvailableShifts } from '../settings/shifts/action';
import {  getWorkDaysByUserEmail, getWorkDaysByUserSession } from './action';
import { getUserByEmail } from '../login/_actions';
import { auth } from '@/src/lib/auth';
import { UniqueRosterCalendarComponent } from '../uniqueRosterCalendarComponent';
import { ShiftsTable } from '@/src/components/tables/shiftsTable';


export default async function lancamento({
    searchParams
}: {
    searchParams: { userEmail: string,rosterId:string};
}) {

    const session = await auth()
    if (!session) return null

  const admin = await getUserByEmail( session.user.email)
  if("code" in admin){
        return <LayoutComponent>
            <main className="flex justify-center items-center p-4 md:p-6 mt-4 w-dvw h-dvh">
        <div className="flex items-center mb-8">
            <h1 className="font-semibold text-lg md:text-2xl">Houve Um Problema ao Carregar a página de Lançamento</h1>

        </div>
        </main>
        </LayoutComponent>
  }
  const userEmail = admin.role === "ADMIN" ?  searchParams.userEmail ?? admin.email : admin.email
const rosterId = searchParams.rosterId ?? ""

        const [ rosters, shifts, workDays,user ] = await Promise.all([rosterId? await getRostersById(rosterId)  : await getRostersBySession(), await getAvailableShifts() , await getWorkDaysByUserEmail(userEmail),await getUserByEmail(userEmail)])
        
        if((!user || "code" in user) || "code" in rosters  || "code" in shifts  || "code" in workDays){
            return <LayoutComponent>
                    <main className="flex justify-center items-center p-4 md:p-6 mt-4 w-dvw h-dvh">
                <div className="flex items-center mb-8">
                    <h1 className="font-semibold text-lg md:text-2xl">Houve Um Problema ao Carregar a página de Lançamento</h1>

                </div>
                </main>
                </LayoutComponent>
        }
       
        return (
            <LayoutComponent>
            <main className="flex flex-1 flex-col p-4 md:p-6 mt-4 w-dvw">
                <div className="flex items-center mb-8">
                    <h1 className="font-semibold text-lg md:text-2xl">Lancamento</h1>
                </div>
                <div className='mx-auto flex flex-col gap-2 items-center'>
                    <div className='mx-auto'>
                        {admin.role === "ADMIN" ? <h2 className='text-lg '>Lançamento da escala de {user.name}</h2> : null}
                    </div>
                    {
                        admin.role === "ADMIN"  && rosterId ?
                        <UniqueRosterCalendarComponent
                        admin={admin}
                        roster={rosters[0]}
                        shifts={shifts}
                        workDays={workDays}
                        user={user}
                        />:
                        <CalendarComponent
                        admin={admin}
                        rosters={rosters}
                        shifts={shifts}
                        workDays={workDays}
                        user={user}
                    />
                    }
                    
                </div>
            </main>
            </LayoutComponent>
    );

    }
   


