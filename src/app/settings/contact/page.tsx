import { ContactFormComponent } from "@/src/components/register/contact/ContactFormComponent";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { auth } from "@/src/lib/auth";




export default async function ContactPage(){

    const session = await auth()
    if(!session){
        return (
            <Card x-chunk="dashboard-04-chunk-1">
                <CardHeader>
                    <CardTitle>Contato</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>o Usuário não está logado</p>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
                <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Escreva sua mensagem para o suporte</p>
                <ContactFormComponent
                emailFromUser={session.user.email}
                />
            </CardContent>
        </Card>
        
    )
}