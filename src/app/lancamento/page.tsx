
/* import { getShiftsControlers, getShiftsCounter } from '@/src/lib/db/sheets/googleSheetsDataSource'; */
import { CalendarComponent } from '@/src/app/calendarComponent';
import { optionsProps } from '@/src/types';
import { LayoutComponent } from '../LayoutComponent';
import { auth } from '../auth';
/* import { getProposalFromCookies, getShiftsFromUser, handleSaveProposal } from './_actions'; */

export default async function lancamento({
    searchParams
}: {
    searchParams: { turnos: string, };
}) {
   
const emptyProposal = ""
const emptyShiftStatus = {availableShifts:[],completeShifts:[]}
const emptyOptions = [{optionTitle:"",optionValues:[]}]

    return (
        <LayoutComponent>
        <main className="flex flex-1 flex-col p-4 md:p-6 w-dvw">
            <div className="flex items-center mb-8">
                <h1 className="font-semibold text-lg md:text-2xl">Lancamento</h1>
            </div>
            <div className='mx-auto'>
                <CalendarComponent
                    proposal={emptyProposal}
                    options={emptyOptions}
                    shiftsStatus={emptyShiftStatus}
                />
            </div>
        </main>
        </LayoutComponent>

    );
}
