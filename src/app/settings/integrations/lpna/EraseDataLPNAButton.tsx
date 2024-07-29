"use client";
import { Button } from "@/src/components/ui/button";
import { useCookies } from 'next-client-cookies';
import { useRouter } from "next/navigation";




export function  EraseDataLpnaButton() {
    const cookies = useCookies();
    const router = useRouter();

    async function handleRemoveCookie() {
            cookies.remove('lpna_access_token')
            router.refresh();

    }

    return (
        <Button onClick={handleRemoveCookie} variant="link">Apagar dados da LPNA e tentar novamente</Button>
    )
}