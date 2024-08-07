'use server';
import { auth } from '@/src/lib/auth';
import prisma from '@/src/lib/db/prisma/prismaClient';
import { $Enums } from '@prisma/client';
import { getUserByEmail } from '../login/_actions';
import { getAvailableShiftsDayUsingVectors } from '@/src/lib/utils';

export async function getWorkDaysByUserSession() {
  const session = await auth();
  if (!session) {
    return {
      code: 401,
      message: 'Usuário não autenticado'
    };
  }
  const email = session.user.email;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      prisma.$disconnect();
      return {
        code: 404,
        message: 'Usuário não encontrado'
      };
    }
    const workDays = await prisma.workDay.findMany({
      where: {
        userId: user.id
      }
    });
    prisma.$disconnect();
    return workDays;
  } catch (e) {
    return {
      code: 500,
      message: 'Erro ao buscar dias de trabalho'
    };
  }
}

export async function getAvailableShiftsDay(day: Date) {
  try {




    const session = await auth();
    if (!session) {
      return {
        code: 401,
        message: 'Usuário não autenticado'
      };
    }
    const user = await getUserByEmail(session.user.email);
    if ('code' in user) {
      return {
        code: user.code,
        message: user.message
      };
    }
    const monthInEnglishWithThreeLetters = day
      .toLocaleString('en', { month: 'short' })
      .toUpperCase() as keyof typeof $Enums.Months;
    const month = $Enums.Months[monthInEnglishWithThreeLetters];

    const [rosterByMonthAndYear,supShifts,opeShifts,workDays,Allusers] = await Promise.all([await prisma.roster.findFirst({
      where: {
        month: month,
        year: day.getFullYear(),
        departmentId: user.departmentId
      }
    }),
    await prisma.shift.findMany({
      where: {
        departmentId: user.departmentId,
        isOnlyToSup: true,
        isAbscence: false,
        quantity: {
          gt: 0
        }
      }
    }),
    await prisma.shift.findMany({
      where: {
        departmentId: user.departmentId,
        isOnlyToSup: false,
        isAbscence: false,
        quantity: {
          gt: 0
        }
      }
    }),
    await prisma.workDay.findMany({
      where: {
        departmentId: user.departmentId,
      }
    }),
    await prisma.user.findMany({
      where: {
        departmentId: user.departmentId
      }
    })

  
  
  ])

    if (!rosterByMonthAndYear) {
      return {
        code: 404,
        message: 'Escala não encontrada'
      };
    }
    const userIsAdmin = user.role === 'ADMIN';
    const userIsSup = user.function === 'SUP';

    const shifts = userIsAdmin
      ? [...supShifts, ...opeShifts]
      : userIsSup
        ? [...supShifts, ...opeShifts]
        : opeShifts;

    if (!shifts) {
      return {
        code: 404,
        message: 'Turnos não encontrados'
      };
    }


    /*   const counterShiftsPerday = shifts.map(shift => {
    const shiftPerDay = WorkDaysColumn.map(day => {
      const newDate = new Date(dateFromRoster.getFullYear(),dateFromRoster.getMonth(),day)
      if(workDays.length === 0){
        return {
          shift,
          day: newDate,
          quantity: shift.quantity,
          count: shift.quantity,
          sum: 0,
          isComplete: false
        }
      }

      const workDaysReducedByDay = workDays.filter(workDay => workDay.shiftId === shift.id && handleisSameDate(workDay.day,newDate)).reduce((acc,curr) => {
        return acc + 1
      }
      ,0)
        if(workDaysReducedByDay >= shift.quantity){
            return {
            shift,
            shiftName: shift.name,
            day: newDate,
            quantity: shift.quantity,
            count: shift.quantity - workDaysReducedByDay,
            sum: workDaysReducedByDay,
            isComplete: true
            }
        }

      return {
        shift,
        day: newDate,
        quantity: workDaysReducedByDay,
        count: shift.quantity - workDaysReducedByDay,
        sum: workDaysReducedByDay,
        isComplete: false
      }

    })

      return {
        shift: shift,
        days: shiftPerDay

      }
      
    }) */
    const dateOnly = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    /* const counterShiftsPerday = (
      shifts.map((shift) => {
        const workDaysReducedByDay = workDays.filter(w=>w.shiftsId.includes(shift.id) && w.day.getDate() === dateOnly.getDate() && w.day.getMonth() === dateOnly.getMonth() && w.day.getFullYear() === dateOnly.getFullYear()).length;
        const isComplete = workDaysReducedByDay >= shift.quantity;
        const count = Math.abs(shift.quantity - workDaysReducedByDay)
     

        return {
          shift,
          day,
          quantity: shift.quantity,
          count,
          sum: workDaysReducedByDay,
          isComplete
        };
      })
    ); */

    const counterShiftsPerday = getAvailableShiftsDayUsingVectors({
      shifts,
      workDays,
      roster:rosterByMonthAndYear,
      users:Allusers
    });

    const completeShifts = counterShiftsPerday.filter(
      (shift) => shift.isComplete && shift.shift.quantity > 0 && shift.day === dateOnly.getDate()
    );
    const incompleteShifts = counterShiftsPerday.filter(
      (shift) => !shift.isComplete && shift.shift.quantity > 0 && shift.day === dateOnly.getDate()
    );

    return [
      {
        title: 'Turnos Completos',
        shifts: completeShifts
      },
      {
        title: 'Turnos Incompletos',
        shifts: incompleteShifts
      }
    ];
  } catch (e) {
    console.log(e);
    return {
      code: 500,
      message: 'Erro ao buscar turnos disponíveis'
    };
  }
}

export async function getWorkDaysByUserEmail(userEmail: string) {
  const session = await auth();
  if (!session) {
    return {
      code: 401,
      message: 'Usuário não autenticado'
    };
  }
  const email = userEmail;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      prisma.$disconnect();
      return {
        code: 404,
        message: 'Usuário não encontrado'
      };
    }
    const workDays = await prisma.workDay.findMany({
      where: {
        userId: user.id
      }
    });
    prisma.$disconnect();
    return workDays;
  } catch (e) {
    return {
      code: 500,
      message: 'Erro ao buscar dias de trabalho'
    };
  }
}

export async function getWorkDays() {
  const session = await auth();
  if (!session) {
    return {
      code: 401,
      message: 'Usuário não autenticado'
    };
  }
  const email = session.user.email;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      prisma.$disconnect();
      return {
        code: 404,
        message: 'Usuário não encontrado'
      };
    }
    const workDays = await prisma.workDay.findMany({
      where: {
        departmentId: user.departmentId
      }
    });
    prisma.$disconnect();
    return workDays;
  } catch (e) {
    return {
      code: 500,
      message: 'Erro ao buscar dias de trabalho'
    };
  }
}
