'use client'

import { CircleHelp, Copy } from "lucide-react"
import { useToast } from "../ui/use-toast"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"

import { DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose ,Drawer} from "../ui/drawer"



export  function InformationCreateManyUsersButton( ) {
    const {toast} = useToast()
    return(
        
<Drawer>
  <DrawerTrigger><CircleHelp/></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Como realizar Integração com o Google Sheets</DrawerTitle>
      <DrawerDescription className="flex justify-start items-start flex-col gap-4 mt-4">
        <div>
        Criando uma integração com o google Sheets:
        </div>
        <div>
    1. Crie uma planilha no google Sheets.

        </div>
        <div>
    2. Copie o id da planilha.

        </div>
        <div>
    3. Cole o id da planilha no campo abaixo.

        </div>
        <div>
    4. Clique em salvar.

        </div>
    <Separator/>
    <div>
    Compartilhando a planilha com o sistema:

    </div>
    <div className="flex flex-col gap-4 items-start justify-start">
        <div>
        1. Compartilhe a planilha com o email: 
        </div>
        <Button variant="link"  className="flex gap-4" onClick={async () => {
            await navigator.clipboard.writeText("shift-app@hybrid-life-372218.iam.gserviceaccount.com")
            toast({
                title: "Email copiado",
                description: "Email copiado para a área de transferência",
            })
        }}>
            {"shift-app@hybrid-life-372218.iam.gserviceaccount.com"}
            <Copy/>
        </Button>
    </div>
    <div>
    2. Dê permissão de editor.
    </div>
    <div>
    3. Clique em salvar.
    </div>
    
    <Separator/>
    <div>
    Se tudo ocorrer bem, a planilha será carregada e você terá feito a integração com o Google Sheets.
    </div>
    </DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose>
        <Button variant="outline">Fechar</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

    )
}