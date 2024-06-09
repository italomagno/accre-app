"use client"
import { Logo } from "@/components/icons";
import { ToggleThemeProviderButton } from "@/components/theme/toggleThemeProviderButton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { AlignJustify } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

interface TriggerButtonProps {
    children: ReactNode;
}

export function TriggerButton({ children }: TriggerButtonProps) {
    const {theme} = useTheme()
    return (
        <Sheet >
            <SheetTrigger asChild>
                <Button  variant="outline" size="icon" className="lg:hidden ">
                    <AlignJustify  className={`h-[1.2rem] w-[1.2rem]`}/>
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className="max-w-[280px]">
                <SheetHeader>
                    <SheetTitle><div className="flex items-center gap-2 font-semibold lg:hidden">
                    <Logo />
                    <span className="">Shift-App</span>
                </div></SheetTitle>
                  
                </SheetHeader>
                {children}
                <SheetFooter className="absolute bottom-7 lef-5">
                        <ToggleThemeProviderButton />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
