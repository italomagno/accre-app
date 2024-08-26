
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/src/components/ui/dialog';
import { ShowAvailableShiftsComponent } from '../components/ShowAvailableShiftsComponent';
import { Separator } from '../components/ui/separator';
import { Roster, Shift, User, WorkDay } from '@prisma/client';
import { RegisterWorkDayForm } from '../components/register/workDay/RegisterWorkDayForm';

interface DialogComponentProps {
  day: Date;
  workDay?: WorkDay ;
  rosterId?: string;
  shiftInThisDay: string;
  isSameMonth: boolean;
  onWorkDayUpdate?: (workDay: Exclude<WorkDay,'id'>,rosterId:string) => void;
}

export function DialogComponent({
  day,
  rosterId,
  workDay,
  shiftInThisDay,
  isSameMonth,
  onWorkDayUpdate: handleUpdateWorkDay

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
        <DialogDescription>
        </DialogDescription>
          <ShowAvailableShiftsComponent day={day}         />
          <Separator className="my-6" />
          <RegisterWorkDayForm
          rosterId={rosterId}
          onWorkDayUpdate={handleUpdateWorkDay!}
          day={day}
          workDay={workDay}
          />
          <Separator className="my-6" />
      </DialogHeader>
    </DialogContent>
    </Dialog>
  );
}
