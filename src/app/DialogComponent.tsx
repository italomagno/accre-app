
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
import { Shift, WorkDay } from '@prisma/client';
import { RegisterWorkDayForm } from '../components/register/workDay/RegisterWorkDayForm';

interface DialogComponentProps {
  day: Date;
  workDay?: WorkDay ;
  shifts: Shift[];
  shiftInThisDay: string;
  isSameMonth: boolean;
}

export function DialogComponent({
  day,
  workDay,
  shiftInThisDay,
  isSameMonth

}: DialogComponentProps): JSX.Element {

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant={"ghost"} disabled={!isSameMonth}>
                {shiftInThisDay}
            </Button>
        </DialogTrigger>
    <DialogContent className="max-h-dvh overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="mb-4">
          Faça sua escolha de proposição para o dia {day.getDate()}
        </DialogTitle>
        <DialogDescription>
        </DialogDescription>
          <ShowAvailableShiftsComponent
          day={day}
          />
          <Separator className="my-6" />
          <RegisterWorkDayForm
          day={day}
          workDay={workDay}
          />
          <Separator className="my-6" />
      </DialogHeader>
      <DialogFooter>
        <RemoveWorkDayButton date={day} />
      </DialogFooter>
    </DialogContent>
    </Dialog>
  );
}
