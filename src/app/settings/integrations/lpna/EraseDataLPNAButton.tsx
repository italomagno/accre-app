"use client";
import { Button } from "@/src/components/ui/button";
import { useCookies } from 'next-client-cookies';




export function  EraseDataLpnaButton() {
    const cookies = useCookies();

    async function handleRemoveCookie() {
            cookies.remove('lpna_access_token')
    }

    return (
        <Button onClick={handleRemoveCookie} variant="link">Apagar dados da LPNA e tentar novamente</Button>
    )
}