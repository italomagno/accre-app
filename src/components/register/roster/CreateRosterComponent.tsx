import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Months } from "@prisma/client";
import { generateUniqueKey } from "@/src/lib/utils";
import { Label } from "../../ui/label";



export function CreateRosterComponent(){
  
    return(
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Criar escala operacional</CardTitle>
                <CardDescription>
                  Preencha os dados da escala.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col w-full justify-evenly gap-4">
                    <div className="flex w-full justify-evenly gap-4">
                        <div className="w-full flex flex-col gap-3">
                        <Label>Escolha o mês que será criada a escala</Label>
                  <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Escolha o mês..."/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            Object.keys(Months).map(month=><SelectItem key={generateUniqueKey()}value={month}>{month}</SelectItem>)
                        }
                    </SelectContent>
                  </Select>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                  <Label>Escolha o ano que será criada a escala</Label>
                  <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Escolha o ano..."/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            [2024,2025,2026,2027,2028,2029 ].map(year=><SelectItem key={generateUniqueKey()} value={String(year)}>{year}</SelectItem>)
                        }
                    </SelectContent>
                  </Select>

                        </div>
                    </div>
                    <div className="flex w-full justify-evenly gap-4">
                        <div className="w-full flex flex-col gap-3">
                        <Label>Escolha a quantidade mínima de horas</Label>
                        <Input type="number" placeholder="Minimo de horas por controlador"/>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                        <Label>Escolha a quantidade máxima de horas</Label>
                        <Input type="number" placeholder="Máxima de horas por controlador"/>
                        </div>
                    </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Criar escala operacional</Button>
              </CardFooter>
            </Card>
    )
}