"use client"
import { Button } from "@/src/components/ui/button";
import { removeCookiesLPNA } from "./actions";



export function  EraseDataLpnaButton() {
    return (
        <Button onClick={async()=>{
            await removeCookiesLPNA()
        }} variant="link">Apagar dados da LPNA e tentar novamente</Button>
    )
}