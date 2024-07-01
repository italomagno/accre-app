import { CreateRosterComponent } from "@/src/components/register/roster/CreateRosterComponent";
import { getShifts } from "../../shifts/action";
import { EmptyComponentCard } from "@/src/components/EmptyComponentCard";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { getUsersWithFilter } from "../../users/actions";



export default async function createRoster() {
    const pageTitle = "Criar Escala"
    const hasAnyShiftCreated = await getShifts()
    const hasAnyUserCreated = await getUsersWithFilter("")
    const hasErrorOnGetShifts = "code" in hasAnyShiftCreated
    if(hasErrorOnGetShifts && hasAnyShiftCreated.code === 403){
        return(
            <EmptyComponentCard
            title="Turnos"
            error={hasAnyShiftCreated}
            >
                <div className="flex flex-col gap-4">
                    <div>
                Você precisa cadastrar pelo menos um turno antes de criar uma escala.
                    </div>
                    <div><Button variant={"link"}><Link href="/settings/createShift">ir para criar grupo</Link></Button></div>
                </div>

            </EmptyComponentCard>
        )
    }
    const hasErrorOnGetUsers = "code" in hasAnyUserCreated

    if(hasErrorOnGetUsers && hasAnyUserCreated.code === 403){
        return(
            <EmptyComponentCard
            title="Usuários"
            error={hasAnyUserCreated}
            >
                <div className="flex flex-col gap-4">
                    <div>
                Você precisa cadastrar pelo menos um usuário antes de criar uma escala.
                    </div>
                    <div><Button variant={"link"}><Link href="/settings/createUser">ir para criar usuário</Link></Button></div>
                </div>

            </EmptyComponentCard>
        )
    }

    return (
            <CreateRosterComponent/>
    );
}