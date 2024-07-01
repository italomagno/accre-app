"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Months } from "@prisma/client";
import { generateUniqueKey } from "@/src/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../ui/use-toast";
import { CreateShiftValues, createShiftSchema } from "@/src/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../../ui/input-otp";



export function CreateShiftComponent(){
  const {toast} = useToast()
  const form = useForm<CreateShiftValues>({
    resolver: zodResolver(createShiftSchema)
  })

  async function onSubmit(data:CreateShiftValues){
    const result = await createShift(data)
    if("code" in result && result.code !== 200){
      toast({
        title: "Erro ao criar escala operacional",
        description: result.message
      })
      return;
    }
    toast({
      title: "Escala operacional criada com sucesso!",
      description: "Agora você pode acessar a escala operacional criada."
  })
  }

    return(
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Criar escala operacional</CardTitle>
                <CardDescription>
                  Preencha os dados da escala.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full justify-evenly gap-4">
                    <div className="flex w-full justify-evenly gap-4">
                        <div className="w-full flex flex-col gap-3">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({field})=>{

                            return(
                              <FormItem>
                                <FormLabel>
                                  Nome do Turno
                                </FormLabel>
                                <FormControl>
                                <Input placeholder="Nome do Turno" {...field}/>
                                </FormControl>
                                <FormMessage/>

                              </FormItem>
                                
                            )
                        } }
                        />

                        <FormField
                        control={form.control}
                        name="quantity"
                        render={({field})=>{

                            return(
                              <FormItem>
                                <FormLabel>
                                  Quantidade desse Turno em um Dia
                                </FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="Quantidade de Turno por dia" {...field}/>
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                                
                            )
                        }
                        }
                        />
                        </div>
                    </div>
                          <FormField
                          control={form.control}
                          name="minQuantity"
                          render={({field})=>{
                              return(
                                <FormItem>
                                  <FormLabel>
                                    Quantidade mínima necessária desse Turno em um Dia
                                  </FormLabel>
                                  <FormControl>
                                  <Input type="number" placeholder="Minimo de turnos por dia" {...field}/>
                                  </FormControl>
                                  <FormMessage/>

                                </FormItem>
                              )
                          }}
                          />
                          <FormField
                          control={form.control}
                          name="start"
                          render={({field})=>{
                              return(
                                <FormItem>
                                  <FormLabel>
                                    Horário de início do turno
                                  </FormLabel>
                                  <FormControl>
                                  <InputOTP maxLength={4} {...field}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
  </InputOTPGroup>
  <div className="flex flex-col gap-4">
  <InputOTPSeparator />
  <InputOTPSeparator />

  </div>
  <InputOTPGroup>
  <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )
                          }}
                          />
                           <FormField
                          control={form.control}
                          name="end"
                          render={({field})=>{
                              return(
                                <FormItem>
                                  <FormLabel>
                                    Horário de término do turno
                                  </FormLabel>
                                  <FormControl>
                                  <InputOTP maxLength={4} {...field}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
  </InputOTPGroup>
  <div className="flex flex-col gap-4">
  <InputOTPSeparator />
  <InputOTPSeparator />
  </div>
  <InputOTPGroup>
  <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )
                          }}
                          />
                    <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Criar escala operacional</Button>
              </CardFooter>
                </form>
                </Form>
              </CardContent>
           
            </Card>
    )
}