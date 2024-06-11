"use client"
import { Logo } from "@/components/icons";

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { AlignJustify } from "lucide-react";
import { ReactNode } from "react";

interface TriggerButtonProps {
    children: ReactNode;
}

export function TriggerButton({ children }: TriggerButtonProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                    <AlignJustify  className={`h-[1.2rem] w-[1.2rem]`}/>
            </SheetTrigger>
            <SheetContent  side={"left"} className="w-1/2" >
                <SheetHeader>
                    <SheetTitle><div className="flex items-center gap-2 font-semibold lg:hidden">
                    <Logo />
                    <span className="">Shift-App</span>
                </div></SheetTitle>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    );
}
