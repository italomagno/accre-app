import { Logo } from "@/src/components/icons";

export function LoadingComponentForLoginPage(){
    return (
        <div className="absolute z-5 w-dvw h-dvw flex items-center justify-items-center bg-blur">
            <div className="animate-spin repeat-infinite">
                <Logo/>
            </div>
        </div>
    )
}