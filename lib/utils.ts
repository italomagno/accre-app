import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function generateUniqueKey(): string {
  return Math.random().toString(36).substring(2, 15);
}


export function handleSearchParamsForLaunches(searchParams: string) {
  return `${new URLSearchParams({turnos:searchParams})}`
}