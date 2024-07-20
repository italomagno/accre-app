import { Button } from "@/src/components/ui/button";

type EraseDataLpnaButtonProps = {
    handleRemoveCookie: () => Promise<void>
}


export function  EraseDataLpnaButton( {handleRemoveCookie}: EraseDataLpnaButtonProps) {
    return (
        <Button onClick={async()=>{
            const result = await handleRemoveCookie()
        }} variant="link">Apagar dados da LPNA e tentar novamente</Button>
    )
}