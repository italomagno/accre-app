"use client"
import { Roster } from "@prisma/client";
import { ChevronLeftCircle, CircleChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {  useTransition } from 'react';
import { getMonthFromRosterInNumber } from "../../lib/utils";

type NavigateBetweenRostersButtonProps = {
    type: "left" | "right";
    rosters: Roster[];
};

export function NavigateBetweenRostersButton({ rosters, type }: NavigateBetweenRostersButtonProps) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    
    const currentMonth = parseInt(searchParams.get('rosterMonth') || '');
    const currentYear = parseInt(searchParams.get('rosterYear') || '');
    
    const currentIndex = rosters.findIndex(
        roster => getMonthFromRosterInNumber(roster) === currentMonth && roster.year === currentYear
    );
    
    const navigateToRoster = (index: number) => {
        const roster = rosters[index];
        const params = new URLSearchParams(window.location.search);
        params.set('rosterMonth', getMonthFromRosterInNumber(roster).toString());
        params.set('rosterYear', roster.year.toString());

        startTransition(() => {
            router.push(`${pathName}?${params.toString()}`);
            router.refresh()
        });
    };

    const handleClick = () => {
        if (type === "left" && currentIndex > 0) {
            navigateToRoster(currentIndex - 1);
        } else if (type === "right" && currentIndex < rosters.length - 1) {
            navigateToRoster(currentIndex + 1);
        }
    };

    return (
        <Button variant={"ghost"} onClick={handleClick}>
            {type === "right" ? <CircleChevronRight /> : <ChevronLeftCircle />}
        </Button>
    );
}
