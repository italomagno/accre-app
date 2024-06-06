
import { getShiftsControlers } from '@/lib/db';
import { CalendarComponent } from 'app/calendarComponent';
import { optionsProps } from 'types';

export default async function lancamento({
    searchParams
}: {
    searchParams: { [key: number]: string };
}) {

    const controllers = await getShiftsControlers()
    const [abscences, shiftsNames, combinations] = controllers.reduce(
        (acc, controller) => {
            acc[0].push(controller.abscences);
            acc[1].push(controller.shiftName);
            acc[2].push(controller.combinations);
            return acc;
        },
        [[], [], []]
    );

    
    const options:optionsProps[] = [
        { optionTitle: "Turnos", optionValues: [...shiftsNames, ...combinations] },
        { optionTitle: "Afastamentos", optionValues: abscences }
    ]

   

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 w-dvw">
            <div className="flex items-center mb-8">
                <h1 className="font-semibold text-lg md:text-2xl">Lancamento</h1>
            </div>
            <div className='mx-auto'>
                <CalendarComponent
                    proposal={searchParams && ''}
                    options={options}
                
                />
            </div>
        </main>
    );
}
