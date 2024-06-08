"use client"
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

interface TriggerButtonProps {
    children: ReactNode;
}

export function TriggerButton({ children }: TriggerButtonProps) {
    const {theme} = useTheme()
    return (
        <Sheet > {/* Add the 'left' prop here */}
            <SheetTrigger asChild>
                <Button  variant="outline" size="icon" className="lg:hidden">
                    <AlignJustify className={`${theme === "dark "? "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" : "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"}`}/>
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
            </SheetContent>
        </Sheet>
    );
}
