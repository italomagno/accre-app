
import { getShiftsControlers, getShiftsCounter } from '@/src/lib/db';
import { CalendarComponent } from '@/src/app/calendarComponent';
import { optionsProps } from '@/src/types';
import { LayoutComponent } from '../LayoutComponent';
import { auth } from '../auth';
import { getShiftsFromUser, handleSaveShifts } from './_actions';
import { Button } from '@/src/components/ui/button';
import { Error as ErrorType} from '@/src/types';
import { redirect } from 'next/navigation';

export default async function lancamento({
    searchParams
}: {
    searchParams: { turnos: string,
        errors: string | null;
        sucess: boolean | null;
     };
}) {
    const session = await auth();
    const [controllers, { shiftStatus },shifts] = await Promise.all([ getShiftsControlers(), getShiftsCounter(),getShiftsFromUser(session?.user.email as string)])
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

    async function saveProposal() {
        const result = await handleSaveShifts(proposal)
        if((result as ErrorType).error){
            redirect(`/lancamento?errors=${(result as ErrorType).error}`)

        }
        if((result as ErrorType[])[0].error){
            redirect(`/lancamento?errors=${(result as ErrorType[]).map(error=>error.error).join(",")}`)
        }

        redirect(`/lancamento?sucess=true`)
           
    }
   

    return (
        <LayoutComponent>
        <main className="flex flex-1 flex-col p-4 md:p-6 w-dvw">
            <div className="flex items-center mb-8">
                <h1 className="font-semibold text-lg md:text-2xl">Lancamento</h1>
            </div>
            <div className='mx-auto'>
                <CalendarComponent
                errors={searchParams.errors}
                sucess={searchParams.sucess}
                    proposal={proposal}
                    options={options}
                    shiftsStatus={shiftStatus}
                />
            </div>
            <form action={saveProposal} className='mt-2 w-[345px] mx-auto'>
            <Button variant="destructive" className='w-full max-w-screen-sm bg-green-400 hover:bg-green-400/40' type='submit'>
                Salvar Proposição
            </Button>
            </form>
        </main>
        </LayoutComponent>

    );
}
