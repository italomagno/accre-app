import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/src/components/ui/card';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/src/components/ui/dialog';
import { filterShiftsByDay, generateUniqueKey } from '@/src/lib/utils';
import { Shift } from '@prisma/client';
import { Separator } from '@radix-ui/react-dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@radix-ui/react-navigation-menu';
import { RegisterWorkDayButton } from '../components/register/workDay/RegisterWorkDayButton';
import { RemoveWorkDayButton } from '../components/remove/workDay/removeWorkDayButton';
import { ShowAvailableShiftsComponent } from '../components/ShowAvailableShiftsComponent';

interface DialogComponentProps {
  day: Date;
  shifts: Shift[];
}

export function DialogComponent({
  day,
  shifts
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



  return (
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
          <NavigationMenu>
            <NavigationMenuList className="grid grid-cols-2 py-5 px-4 gap-4">
              {options.map((option) => (
                <NavigationMenuItem
                  className="w-full"
                  key={generateUniqueKey()}
                >
                  <NavigationMenuTrigger asChild>
                    <Button className="w-full">
                      {option.optionTitle}
                    </Button>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="mt-2">
                    {option.shifts.map((shift) => (
                      <RegisterWorkDayButton 
                      shift={shift}
                      />
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Separator className="my-6" />
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <RemoveWorkDayButton date={day} />
      </DialogFooter>
    </DialogContent>
  );
}
