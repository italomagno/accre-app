import { DialogHeader } from "@/components/ui/dialog";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { generateUniqueKey } from "@/lib/utils";
import { DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { optionsProps } from "types";
import { Button } from "@/components/ui/button";

interface DialogComponentProps {
    day: string;
    proposal: string;
    options: optionsProps[];
}

export function DialogComponent({ day, options, proposal }: DialogComponentProps): JSX.Element {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Faça sua escolha de proposição para o dia {day}</DialogTitle>
                <DialogDescription>
                    <NavigationMenu>
                        <NavigationMenuList className="flex w-full py-5">
                            {options.map((option) => (
                                <NavigationMenuItem className="w-1/2 mx-auto" key={generateUniqueKey()}>
                                    <NavigationMenuTrigger asChild>
                                        <Button className="w-full mx-auto">{option.optionTitle}</Button>
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        {option.optionValues.map((optionValue) => (
                                            <Link key={generateUniqueKey()} href={`?turnos=${proposal?`${proposal},`:proposal}${day}:${optionValue}`} passHref>
                                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>{optionValue}</NavigationMenuLink>
                                            </Link>
                                        ))}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}
