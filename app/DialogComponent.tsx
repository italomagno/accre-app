import { DialogHeader } from "@/components/ui/dialog";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { filterShiftsByDay, generateUniqueKey } from "@/lib/utils";
import { DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { ShiftsStatusProps, optionsProps } from "types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Faça sua escolha de proposição para o dia {day}</DialogTitle>
                <DialogDescription>

                    <Separator className="my-6"/>
                    {filteredShifts.availableShifts.map(shift=><div key={generateUniqueKey()}>{shift.shiftName}/{shift.missingQuantity}</div>)}

                    <Separator className="my-6"/>
                    {filteredShifts.completeShifts.map(shift=><div key={generateUniqueKey()}>{shift.shiftName}/{shift.quantity}</div>)}

                    <NavigationMenu>
                        <NavigationMenuList className="flex w-full py-5 gap-4">
                            {options.map((option) => (
                                <NavigationMenuItem className="w-1/2 mx-auto" key={generateUniqueKey()}>
                                    <NavigationMenuTrigger asChild>
                                        <Button className="w-full mx-auto">{option.optionTitle}</Button>
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
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
        </DialogContent>
    );
}
