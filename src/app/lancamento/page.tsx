
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
    /* const session = await auth();
    const proposalFromCookies = await getProposalFromCookies()
    //@ts-ignore
    const [controllers, { shiftStatus },shifts] = await Promise.all([ getShiftsControlers(), getShiftsCounter(),proposalFromCookies ? {shifts:proposalFromCookies} : getShiftsFromUser(session?.user.email as string)])
    const [abscences, shiftsNames, combinations] = controllers.reduce(
        (acc, controller) => {
            controller.abscences && acc[0].push(controller.abscences);
            controller.shiftName && acc[1].push(controller.shiftName);
            controller.combinations && acc[2].push(controller.combinations);
            return acc;
        },
        [[], [], []]
    );
   
    
    const options:optionsProps[] = [
        { optionTitle: "Turnos", optionValues: [...shiftsNames, ...combinations] },
        { optionTitle: "Afastamentos", optionValues: abscences }
    ]
    const shiftsInVector = shifts?.shifts?.split(",").map((shift) => {
        const [day, shiftName] = shift.split(":");
        return { day: parseInt(day), shiftName };
    })
    if(!searchParams.turnos) searchParams.turnos = ""
    const searchParamsInvector = searchParams.turnos.split(",").map((shift) => {
        const [day, shiftName] = shift.split(":");
        return { day: parseInt(day), shiftName };
    })
    const newProposal = shiftsInVector?.map((shift) => {
        const shiftName = searchParamsInvector.find((searchShift) => searchShift.day === shift.day)?.shiftName;
        return `${shift.day}:${shiftName || shift.shiftName}`.replaceAll("undefined", "-");
    }).join(",");
    const proposal = newProposal || "";
 */
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
