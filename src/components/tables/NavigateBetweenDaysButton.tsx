"use client"
import { Roster } from "@prisma/client";
import { ChevronLeftCircle, CircleChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {  useTransition } from 'react';
import { createWorkDaysColumn } from "../../lib/utils";

type NavigateBetweenRostersButtonProps = {
    type: "left" | "right";
    roster: Roster
};

export function NavigateBetweenDaysButton({ roster, type }: NavigateBetweenRostersButtonProps) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const days = createWorkDaysColumn(roster)
    const [isPending, startTransition] = useTransition();
    
    const currentDay = parseInt(searchParams.get('day') || '');
    
    const currentIndex = days.findIndex(
        day => day === currentDay
    );
    
    const navigateToRoster = (index: number) => {
        const day = days[index];
        const params = new URLSearchParams(window.location.search);
        params.set('day', day.toString());
        startTransition(() => {
            router.push(`${pathName}?${params.toString()}`);
            router.refresh()
        });
    };

    const handleClick = () => {
        if (type === "left" && currentIndex > 0) {
            navigateToRoster(currentIndex - 1);
        } else if (type === "right" && currentIndex < days.length - 1) {
            navigateToRoster(currentIndex + 1);
        }
    };

    return (
        <Button variant={"ghost"} onClick={handleClick}>
            {type === "right" ? <CircleChevronRight /> : <ChevronLeftCircle />}
        </Button>
    );
}
