import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { filterShiftsByDay, generateUniqueKey } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Link from "next/link";

import { ShiftsStatusProps, optionsProps } from "types";

interface DialogComponentProps {
    day: string;
    proposal: string;
    options: optionsProps[];
    shiftsStatus:ShiftsStatusProps
}

export function DialogComponent({ day, options, proposal,shiftsStatus }: DialogComponentProps): JSX.Element {
    const roposalSplitted = proposal? proposal.split(",") : []
    const proposalModified = roposalSplitted
        .filter(proposalShift => {
            const [dayFromProposal] = proposalShift.split(":");
            return dayFromProposal !== day;
        })
        .join(",");

        const filteredShifts = filterShiftsByDay(shiftsStatus, Number(day));

    return (
        <DialogContent className="max-h-dvh overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="mb-4">Faça sua escolha de proposição para o dia {day}</DialogTitle>
                <DialogDescription>
                    <div className="w-full grid grid-cols-2 gap-2">
                    <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Turnos Completos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                    {filteredShifts.completeShifts.map(shift=><Badge className="flex flex-col text-xl" key={generateUniqueKey()}> {/* <div>{`${shift.quantity > 1 ?`Existem ${shift.quantity}` : `Existe ${shift.quantity}` }`}</div> */}
                        <div>{`${shift.shiftName} (${shift.quantity})`}</div> </Badge>)}

  </CardContent>
 
</Card>

<Card className="w-full">
                    <CardHeader>
                        <CardTitle>Turnos Incompletos</CardTitle>
                    </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                        {filteredShifts.availableShifts.map(shift=><Badge className="flex flex-col gap-2 text-xl" key={generateUniqueKey()}> {/* <div>{`${shift.missingQuantity > 1 ?`Faltam ${shift.missingQuantity}` : `Falta ${shift.missingQuantity}` }`}</div> */}
                        <div>{`${shift.shiftName} (${shift.missingQuantity})`}</div> </Badge>)}
  </CardContent>
 
</Card>


                    </div>
                    <Separator className="my-6"/>
                    


                    <NavigationMenu>
                        <NavigationMenuList className="flex w-full py-5 gap-4">
                            {options.map((option) => (
                                <NavigationMenuItem className="w-1/2 mx-auto" key={generateUniqueKey()}>
                                    <NavigationMenuTrigger asChild>
                                        <Button className="w-full mx-auto">{option.optionTitle}</Button>
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="mt-2">
                                        {option.optionValues.map((optionValue) => (
                                            <Link key={generateUniqueKey()} href={`?turnos=${proposalModified?`${proposalModified},`:proposalModified}${day}:${optionValue}`.replace("undefined","")} passHref>
                                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>{optionValue}</NavigationMenuLink>
                                            </Link>
                                        ))}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <Separator className="my-6"/>
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="destructive"className="w-full">
                <Link className="w-full" href={`?turnos=${proposalModified?`${proposalModified},` :proposalModified}`.replace("undefined","")}><span>Apagar proposição do dia {day}</span></Link>
                </Button>

            </DialogFooter>

        </DialogContent>
    );
}
