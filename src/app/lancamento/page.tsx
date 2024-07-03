
/* import { getShiftsControlers, getShiftsCounter } from '@/src/lib/db/sheets/googleSheetsDataSource'; */
import { CalendarComponent } from '@/src/app/calendarComponent';

import { LayoutComponent } from '../LayoutComponent';
import { getRostersBySession } from '../settings/roster/actions';
import { getAvailableShifts } from '../settings/shifts/action';
import {  getWorkDaysByUserSession } from './_actions';
/* import { getProposalFromCookies, getShiftsFromUser, handleSaveProposal } from './_actions'; */

export default async function lancamento({
    searchParams
}: {
    searchParams: { turnos: string, };
}) {


    const [ rosters, shifts, workDays ] =await Promise.all([ getRostersBySession(), getAvailableShifts() , getWorkDaysByUserSession()]) 

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


