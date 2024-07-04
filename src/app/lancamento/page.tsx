

import { CalendarComponent } from '@/src/app/calendarComponent';
import { LayoutComponent } from '../LayoutComponent';
import { getRostersBySession } from '../settings/roster/actions';
import { getAvailableShifts } from '../settings/shifts/action';
import {  getWorkDaysByUserSession } from './action';


export default async function Lancamento({
    searchParams
}: {
    searchParams: { turnos: string, };
}) {


    try{
        const [ rosters, shifts, workDays ] = await Promise.all([ getRostersBySession(), getAvailableShifts() , getWorkDaysByUserSession()]) 

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
                    />
                </div>
            </main>
            </LayoutComponent>
    );

    }
    catch(e){
        console.log(e)
        return {
            code: 500,
            message: 'Erro ao buscar turnos disponíveis'
        }
   
    }
}


