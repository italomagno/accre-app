
import { getShiftsControlers, getShiftsCounter } from '@/lib/db';
import { getShiftsStatus } from '@/lib/utils';
import { CalendarComponent } from 'app/calendarComponent';
import { optionsProps } from 'types';

export default async function lancamento({
    searchParams
}: {
    searchParams: { turnos: string; };
}) {

    const [controllers, { shiftStatus }] = await Promise.all([ getShiftsControlers(), getShiftsCounter()])
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

    const proposal = searchParams.turnos 
   

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 w-dvw">
            <div className="flex items-center mb-8">
                <h1 className="font-semibold text-lg md:text-2xl">Lancamento</h1>
            </div>
            <div className='mx-auto'>
                <CalendarComponent
                    proposal={proposal}
                    options={options}
                    shiftsStatus={shiftStatus}
                
                />
            </div>
        </main>
    );
}
