"use client"

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";

import { AlignJustify } from "lucide-react";
import { ReactNode } from "react";
import { Logo } from "../components/ui/icons";
import { Button } from "../components/ui/button";

interface TriggerButtonProps {
    children: ReactNode;
}

export function TriggerButton({ children }: TriggerButtonProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
                    <AlignJustify  className={`h-[1.2rem] w-[1.2rem]`}/>
                </Button>
            </SheetTrigger>
            <SheetContent  side={"left"} className="w-1/2 space-y-2" >
                <SheetHeader>
                    <SheetTitle><div className="flex items-center gap-2 font-semibold">
                    <Logo />
                    <span className="">Shift-App</span>
                </div></SheetTitle>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    );
}
