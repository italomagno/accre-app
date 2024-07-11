

import { CalendarComponent } from '@/src/app/calendarComponent';
import { LayoutComponent } from '../LayoutComponent';
import { getRostersBySession } from '../settings/roster/actions';
import { getAvailableShifts } from '../settings/shifts/action';
import {  getWorkDaysByUserSession } from './action';
import { getUserByEmail } from '../login/_actions';
import { auth } from '@/src/lib/auth';


export default async function lancamento({
    searchParams
}: {
    searchParams: { turnos: string, };

}) {
    const session = await auth()
    if (!session) return null
  
        const [ rosters, shifts, workDays,user ] = await Promise.all([ await getRostersBySession(), await getAvailableShifts() , await getWorkDaysByUserSession(), await getUserByEmail( session.user.email)])
        
        if((!user || "code" in user) || "code" in rosters  || "code" in shifts  || "code" in workDays){
            return <LayoutComponent>
                    <main className="flex flex-1 flex-col p-4 md:p-6 mt-4 w-dvw">
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
                <div className='mx-auto'>
                    <CalendarComponent
                        rosters={rosters}
                        shifts={shifts}
                        workDays={workDays}
                        user={user}
                    />
                </div>
            </main>
            </LayoutComponent>
    );

    }
   


