
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/src/components/ui/dialog';
import { RemoveWorkDayButton } from '../components/remove/workDay/removeWorkDayButton';
import { ShowAvailableShiftsComponent } from '../components/ShowAvailableShiftsComponent';
import { Separator } from '../components/ui/separator';
import { Shift } from '@prisma/client';
import { RegisterWorkDayForm } from '../components/register/workDay/RegisterWorkDayForm';

interface DialogComponentProps {
  day: Date;
  shifts: Shift[];
  shiftInThisDay: string;
}

export function DialogComponent({
  day,
  shifts,

  shiftInThisDay

}: DialogComponentProps): JSX.Element {

    const shiftsThatAreNotAbscence = shifts.filter(shift=> !shift.isAbscence)
    const shiftsThateAreAbscence = shifts.filter(shift=> shift.isAbscence)
    const options = [
        {
            optionTitle: 'Turnos',
            shifts: shiftsThatAreNotAbscence
        },
        {
            optionTitle: 'Afastamentos',
            shifts: shiftsThateAreAbscence
        }
        ];

  type Option = typeof options



  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant={"ghost"}>
                {shiftInThisDay}
            </Button>
        </DialogTrigger>
    <DialogContent className="max-h-dvh overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="mb-4">
          Faça sua escolha de proposição para o dia {day.getDate()}
        </DialogTitle>
        <DialogDescription>
          <ShowAvailableShiftsComponent
          day={day}
          />
          <Separator className="my-6" />
          <RegisterWorkDayForm
          absences={shiftsThateAreAbscence}
          shifts={shiftsThatAreNotAbscence}
          />
          <Separator className="my-6" />
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <RemoveWorkDayButton date={day} />
      </DialogFooter>
    </DialogContent>
    </Dialog>
  );
}
