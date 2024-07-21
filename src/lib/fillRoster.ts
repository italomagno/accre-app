"use server"
import { Shift } from "@prisma/client";
import { addDays, differenceInHours, isAfter, isBefore, parse } from 'date-fns';
import { auth } from "./auth";
import { ErrorTypes } from "../types";
import { getUserByEmail } from "../app/login/_actions";
import prisma from "./db/prisma/prismaClient";

// Helper function to parse a time string (e.g., "20:00") into a Date object on the current day
const parseTime = (time: string): Date => {
  return parse(time, 'HH:mm', new Date());
};

// Function to calculate if there are two days of rest after a given date
const hasTwoDaysRest = (date: Date, roster: string[][]): boolean => {
  const dayIndex = date.getDate();
  if (dayIndex + 2 > roster[0].length - 1) {
    return false;
  }
  return roster.every((userRoster) => userRoster[dayIndex + 1] === '-' && userRoster[dayIndex + 2] === '-');
};

// Function to check if a shift can be assigned to a user on a given day
const canAssignShift = (
  userRoster: string[],
  dayIndex: number,
  shift: Shift,
  shifts: Shift[],
  roster: string[][]
): boolean => {
  if (userRoster[dayIndex] !== '-') {
    return false;
  }

  let consecutiveShifts = 0;
  for (let i = dayIndex; i >= 0 && i >= dayIndex - 5; i--) {
    if (userRoster[i] !== '-') {
      consecutiveShifts++;
    } else {
      break;
    }
  }
  if (consecutiveShifts >= 6 && !hasTwoDaysRest(addDays(new Date(), dayIndex + 1), roster)) {
    return false;
  }

  if (dayIndex > 0) {
    const previousDayShift = userRoster[dayIndex - 1];
    if (previousDayShift !== '-') {
      const [shiftName] = previousDayShift.split('|');
      const previousShift = shifts.find((s) => s.name === shiftName);
      if (previousShift) {
        const previousShiftEnd = parseTime(previousShift.end.toISOString().slice(11, 16));
        if (isAfter(previousShiftEnd, parseTime('20:45')) && isBefore(previousShiftEnd, parseTime('06:00'))) {
          return false;
        }
      }
    }
  }

  return true;
};

// Function to fill the roster table with shifts
export const fillRoster = async (roster: string[][]): Promise<string[][] | ErrorTypes> => {
  try {
    const session = await auth();
    if (!session) return { code: 401, message: "Usuário não autenticado" };

    const user = await getUserByEmail(session.user.email);
    if ("code" in user) return { code: user.code, message: user.message };

    const shifts = await prisma.shift.findMany({
      where: { departmentId: user.departmentId }
    });

    const updatedRoster = [...roster];

    shifts.forEach((shift) => {
      let assignedShifts = 0;

      for (let dayIndex = 1; dayIndex < roster[0].length; dayIndex++) {
        if (assignedShifts >= shift.quantity) {
          break;
        }

        const availableUsers = updatedRoster.filter((userRoster) => {
          const userShifts = userRoster.filter((day) => day.includes(shift.name)).length;
          if (userShifts >= shift.minQuantity) {
            return false;
          }
          return canAssignShift(userRoster, dayIndex, shift, shifts, updatedRoster);
        });

        if (availableUsers.length > 0) {
          const randomUserIndex = Math.floor(Math.random() * availableUsers.length);
          const userRoster = updatedRoster[randomUserIndex];

          if (userRoster[dayIndex] !== '-') {
            const existingShiftEnd = parseTime(userRoster[dayIndex].split('|')[0]);
            const newShiftStart = parseTime(shift.start.toISOString().slice(11, 16));
            const hoursDifference = differenceInHours(newShiftStart, existingShiftEnd);

            if (hoursDifference >= 8) {
              userRoster[dayIndex] += `|${shift.name}`;
            }
          } else {
            userRoster[dayIndex] = shift.name;
          }

          assignedShifts++;
        }
      }
    });


    console.log(JSON.stringify(updatedRoster, null, 2));
    return updatedRoster;

  } catch (error) {
    console.log(error);
    return { code: 500, message: "Erro ao tentar preencher a escala" };
  }
};
