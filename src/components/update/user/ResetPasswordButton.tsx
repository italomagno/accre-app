'use client';

import { RefreshCcw } from "lucide-react";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";
import { resetUserPassword } from "@/src/app/settings/users/createUser/actions";

type ResetPasswordButtonProps = {
    id: string;
};


export function ResetPasswordButton({ id }: ResetPasswordButtonProps) {
    const {toast} = useToast();
    async function handleResetPassword() {
        try {
            const response = await resetUserPassword(id);
            if (response.code === 200) {
                toast({
                    title: "Sucesso",
                    description: response.message,
                });
            }else{
                toast({
                    title: "Erro",
                    description: response.message,
                });
            }
        }
        catch (error) {
            console.error("Erro ao resetar senha:", error);
            toast({
                title: "Erro",
                description: "Erro ao resetar senha.",
            });
    }
}


    return (
        <Button variant={"ghost"} onClick={handleResetPassword}>
            <RefreshCcw/>
        </Button>
    )
}