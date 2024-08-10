'use client';
import { DialogComponent } from './DialogComponent';
import { Calendar } from '../components/ui/calendar';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { handleisSameDate } from '../lib/date';
import { RegisterWorkDayButton } from '../components/register/workDay/RegisterWorkDayButton';
import { useState } from 'react';

export function CalendarComponent({
  shifts,
  rosterId,
  workDays,
  user,
  defaultMonth,
}: {
  shifts: Shift[];
  user: User;
  users: User[];
  defaultMonth: Date;
  roster: Roster;
  rosterId: string;
  workDays: WorkDay[];
}) {
  const [workDaysList, setWorkDaysList] = useState<WorkDay[]>(() => workDays);

  function handleUpdateWorkDay(workDay: WorkDay, rosterId: string) {
    const alreadyExists = workDaysList.find(
      (workDayInList) =>
        workDayInList.day.getDate() === workDay.day.getDate() &&
        workDayInList.day.getMonth() === workDay.day.getMonth() &&
        workDayInList.day.getFullYear() === workDay.day.getFullYear()
    );
    if (alreadyExists) {
      const updatedWorkDays = workDaysList.map((workDayInList) => {
        if (handleisSameDate(workDayInList.day, workDay.day)) {
          return workDay;
        }
        return workDayInList;
      });
      setWorkDaysList(updatedWorkDays);
    } else {
      const newWorkDay: WorkDay = {
        ...workDay,
        userId: user.id,
        rosterId: rosterId
      };
      setWorkDaysList([...workDaysList, newWorkDay]);
    }
  }

  return (
    <>
      <Calendar
        mode="default"
        month={defaultMonth}
        components={{
          Day: (props) => {
            const isSameMonth =
              props.date.getMonth() === props.displayMonth.getMonth();

            const workDay = workDaysList.find(
              (workDay) =>
                workDay.day.getDate() === props.date.getDate() &&
                workDay.day.getMonth() === props.date.getMonth() &&
                workDay.day.getFullYear() === props.date.getFullYear()
            );
            const shiftsInThisWorkDay = workDay
              ? workDay.shiftsId
                  .map((id) => {
                    const shift = shifts.find((shift) => shift.id === id);
                    return shift || null;
                  })
                  .filter((shift): shift is Shift => shift !== null)
              : [];
            const shiftInThisDay =
              shiftsInThisWorkDay.length > 0
                ? shiftsInThisWorkDay.map((shift) => shift.name).join(' | ')
                : '-';

            return isSameMonth ? (
              <div className="flex flex-col gap-3 text-2xl">
                {props.date.getDate()}
                <DialogComponent
                  day={props.date}
                  rosterId={rosterId}
                  workDay={workDay}
                  shiftInThisDay={shiftInThisDay}
                  isSameMonth={isSameMonth}
                  onWorkDayUpdate={handleUpdateWorkDay}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-2xl">
                {props.date.getDate()}
                <div>
                  <DialogComponent
                    day={props.date}
                    rosterId={rosterId}
                    workDay={workDay}
                    shiftInThisDay={shiftInThisDay}
                    isSameMonth={isSameMonth}
                  />
                </div>
              </div>
            );
          }
        }}
      />
      <RegisterWorkDayButton
        workDays={workDaysList}
        rosterId={rosterId}
        hasRestrictionsToSave={true}
      />
    </>
  );
}
