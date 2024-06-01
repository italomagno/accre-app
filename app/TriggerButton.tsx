import { Logo } from "@/components/icons";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";

interface TriggerButtonProps {
    children: ReactNode;
}

export function TriggerButton({ children }: TriggerButtonProps) {
    return (
        <Sheet > {/* Add the 'left' prop here */}
            <SheetTrigger asChild>
                <button className="flex items-center gap-2 font-semibold lg:hidden">
                    <Logo />
                    <span className="">Shift-App</span>
                </button>
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
