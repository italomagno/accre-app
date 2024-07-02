"use client"
import Link from "next/link";
import { Textarea } from "../../ui/textarea";
import { useState } from "react";

type ContactFormComponentProps = {
    emailFromUser: string;
}

export function ContactFormComponent( {emailFromUser}: ContactFormComponentProps) {
    const [message, setMessage] = useState<string>("");
    const email = 'italomagno10@gmail.com';
    const subject =` Contato sobre o Shift-app do usuário ${emailFromUser}`;
    const body = message ?? "Não há mensagem registrada";
  
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  

    function handleMessageChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setMessage(event.target.value);
    }


    return(
    <div className="grid w-full gap-2">
      <Textarea placeholder="Escreva sua mensagem aqui."  onChange={handleMessageChange}/>
      <Link href={mailtoLink} className="text-primary underline-offset-4 hover:underline">Enviar Email de contato</Link>
    </div>
    )
}