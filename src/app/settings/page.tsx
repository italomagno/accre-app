
import Link from "next/link"

import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"

import { LogoExtended } from "@/src/components/icons"
import { Separator } from "@/src/components/ui/separator"


export default async function SettingsPage() {
  return (
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Selecione as opções no menu navegação.</CardTitle>
                <CardDescription>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
               <LogoExtended size={128}/>
              </CardContent>
              <Separator className="mb-4"/>
              <CardFooter>
                <Button className="w-fit" variant="link">
                <Link  href={"/"}>Retornar para página inicial</Link>
                </Button>
              </CardFooter>
              </Card>
 
  );
}
