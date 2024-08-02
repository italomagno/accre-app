import { CalendarComponent } from '@/src/app/calendarComponent';
import { LayoutComponent } from '../LayoutComponent';
import {
  getRostersById,
  getRostersBySession
} from '../settings/roster/actions';
import { getAvailableShifts } from '../settings/shifts/action';
import { getWorkDays, getWorkDaysByUserEmail } from './action';
import { getUserByEmail } from '../login/_actions';
import { auth } from '@/src/lib/auth';
import { UniqueRosterCalendarComponent } from '../uniqueRosterCalendarComponent';
import { getAllusers } from '../settings/users/actions';
import { User } from '@prisma/client';
import { getDateFromRoster } from '@/src/lib/utils';

export default async function lancamento({
  searchParams
}: {
  searchParams: { userEmail: string; rosterId: string };
}) {
  const session = await auth();
  if (!session) return null;

  const admin = await getUserByEmail(session.user.email);
  if ('code' in admin) {
    return (
      <LayoutComponent>
        <main className="flex justify-center items-center p-4 md:p-6 mt-4 w-dvw h-dvh">
          <div className="flex items-center mb-8">
            <h1 className="font-semibold text-lg md:text-2xl">
              Houve Um Problema ao Carregar a página de Lançamento
            </h1>
          </div>
        </main>
      </LayoutComponent>
    );
  }
  const userEmail =
    admin.role === 'ADMIN'
      ? searchParams.userEmail ?? admin.email
      : admin.email;
  const rosterId = searchParams.rosterId ?? '';

  const [rosters, shifts, workDays, user, users,AllWorkDays] = await Promise.all([
    rosterId ? await getRostersById(rosterId) : await getRostersBySession(),
    await getAvailableShifts(),
    await getWorkDaysByUserEmail(userEmail),
    await getUserByEmail(userEmail),
    await getAllusers(),
    await getWorkDays()
  ]);

  if (
    !user ||
    'code' in user ||
    'code' in rosters ||
    'code' in shifts ||
    'code' in workDays ||
    'code' in users ||
    'code' in AllWorkDays
  ) {
    return (
      <LayoutComponent>
        <main className="flex justify-center items-center p-4 md:p-6 mt-4 w-dvw h-dvh">
          <div className="flex items-center mb-8">
            <h1 className="font-semibold text-lg md:text-2xl">
              Houve o seguinte problema ao carregar a página lançamento:
            </h1>
            {'code' in user ? (
              <p className="font-semibold text-lg md:text-2xl">
                {user.message} user
              </p>
            ) : null}
            {'code' in rosters ? (
              <p className="font-semibold text-lg md:text-2xl">
                {rosters.message} rosters
              </p>
            ) : null}
            {'code' in shifts ? (
              <p className="font-semibold text-lg md:text-2xl">
                {shifts.message} shifts
              </p>
            ) : null}
            {'code' in workDays ? (
              <p className="font-semibold text-lg md:text-2xl">
                {workDays.message} workdays
              </p>
            ) : null}



            {'code' in users ? (
              <p className="font-semibold text-lg md:text-2xl">
                {users.message} users
              </p>
            ) : null}
          </div>
        </main>
      </LayoutComponent>
    );
  }
  if (rosters.length === 0) {
    return (
      <LayoutComponent>
        <main className="flex justify-center items-center p-4 md:p-6 mt-4 w-dvw h-dvh">
          <div className="flex items-center mb-8">
            <h1 className="font-semibold text-lg md:text-2xl">
              Não há escalas cadastradas para edição. Entre em contato com o
              administrador do seu orgão.
            </h1>
          </div>
        </main>
      </LayoutComponent>
    );
  }
  if (shifts.length === 0) {
    return (
      <LayoutComponent>
        <main className="flex justify-center items-center p-4 md:p-6 mt-4 w-dvw h-dvh">
          <div className="flex items-center mb-8">
            <h1 className="font-semibold text-lg md:text-2xl">
              Ainda não há turnos cadastrados. Entre em contato com o
              administrador do seu orgão.
            </h1>
          </div>
        </main>
      </LayoutComponent>
    );
  }
  if (user.isApproved === false) {
    return (
      <LayoutComponent>
        <main className="flex justify-center items-center p-4 md:p-6 mt-4 w-dvw h-dvh">
          <div className="flex items-center mb-8">
            <h1 className="font-semibold text-lg md:text-2xl">
              Você ainda não foi autorizado pelo administrador do seu orgão.
              Tente contato com ele.
            </h1>
          </div>
        </main>
      </LayoutComponent>
    );
  }
  if (user.block_changes === true) {
    return (
      <LayoutComponent>
        <main className="flex justify-center items-center p-4 md:p-6 mt-4 w-dvw h-dvh">
          <div className="flex items-center mb-8">
            <h1 className="font-semibold text-lg md:text-2xl">
              Ainda não chegou sua vêz de propor sua escala. Solicite ao
              escalante.
            </h1>
          </div>
        </main>
      </LayoutComponent>
    );
  }
  const roster = rosters[0];

  return (
    <LayoutComponent>
      <main className="flex flex-1 flex-col p-4 md:p-6 mt-4 w-dvw">
        <div className="flex items-center mb-8">
          <h1 className="font-semibold text-lg md:text-2xl">Lancamento</h1>
        </div>
        <div className="mx-auto flex flex-col gap-2 items-center">
          <div className="mx-auto">
            {admin.role === 'ADMIN' ? (
              <h2 className="text-lg ">Lançamento da escala de {user.name}</h2>
            ) : null}
          </div>
          {admin.role === 'ADMIN' && rosterId ? (
            <UniqueRosterCalendarComponent
              admin={admin}
              roster={roster}
              shifts={shifts}

              workDays={workDays}
              user={user}
              users={users as User[]}
            />
          ) : (
            <CalendarComponent
              defaultMonth={getDateFromRoster(roster)}
              rosterId={roster.id}
              shifts={shifts}
              workDays={workDays}
              user={user}
              users={users as User[]}
              roster={roster}
            />
          )}
        </div>
      </main>
    </LayoutComponent>
  );
}
