"use client"
import { ErrorTypes } from "@/src/types";
import { CarouselGeralUserComponent } from "./CarouselGeralUserComponent";
import { useToast } from "../../ui/use-toast";
import { useEffect } from "react";
import { CarouselShiftsComponent } from "./CarouselShiftsComponent";
import { LayoutComponent } from "@/src/app/LayoutComponent";



type EmptyHomePageComponentProps = {
      toast: ErrorTypes
  }



export function EmptyHomePageComponent( {toast:toastFromComponent}: EmptyHomePageComponentProps) {
  const {toast} = useToast()
  useEffect(() => {
    toast({
        title: `Código ${toastFromComponent.code}`,
        description: toastFromComponent.message,
    })
}
, [toastFromComponent]);

    return (
      <LayoutComponent>
        <main className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 mt-14 px-14">
          <CarouselGeralUserComponent rosters={[]} search={""} shifts={[]} workDays={[]} users={[]} />
          <CarouselShiftsComponent rosters={[]} shifts={[]} workDays={[]} users={[]} />
      </main>
      </LayoutComponent>

    )
}