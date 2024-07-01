"use client"


import { UpdateUserValues, updateUserSchema } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/src/components/ui/use-toast";
import {  generateUniqueKey } from "@/src/lib/utils";
import { Separator } from "@/src/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { User,Function } from "@prisma/client";
import { useForm} from "react-hook-form";
import { updateUser } from "@/src/app/settings/users/createUser/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";


interface RegisterUserProps{
    user: Pick<User,"email"|"name"|"function"|"id" |"block_changes"|"isOffice">;
}

export function UpdateUserComponent({user:UserFromTable}:RegisterUserProps){
    const {toast} = useToast();
    const {id,...user} = UserFromTable;


    const onSubmit = async(data:UpdateUserValues) => {
        console.log(data)
        const result = await updateUser(id,data);
        if("code" in result && result.code === 200){
            toast({
                title: "Sucesso",
                description: result.message,
            })
        }else{
            toast({
                title: "Erro",
                description: result.message,
        })
    }

    };
    const functionHeadingKeys = Object.keys(Function)

   
    const form = useForm<UpdateUserValues>({
      resolver: zodResolver(updateUserSchema),
      defaultValues: {
        ...user,
        function: String(user.function),
      },
    });

    //ToDo verfy why this component when i submit form it does not update the user

    return(
        <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
        <CardTitle>Editar usuário</CardTitle>
        <CardDescription>Preencha os dados do turno.</CardDescription>
      </CardHeader>
      <CardContent >
            <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full max-w-[150px] justify-evenly gap-4 "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Nome</FormLabel>
                  <FormControl>
                  <Input placeholder="3S Padrão" {...field} 
                  />
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="3spadrao@gmail.com" {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="function"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição operacional</FormLabel>
                <FormControl>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
    </SelectTrigger>
    <SelectContent>
        {
            functionHeadingKeys.map((key) => {
                return <SelectItem key={generateUniqueKey()} value={key}>{key}</SelectItem>
        }
        )
        }
                          
    </SelectContent>
  </Select>
                </FormControl>
  
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
              control={form.control}
              name="block_changes"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Bloquear trocas do usuário?</FormLabel>

                    <FormControl>
                      <Select
                      defaultValue={String(field.value)}
                      
                      onValueChange={(e)=>{
                        var input
                        if(e === 'true'){
                          input = true}
                          if(e === 'false'){
                            input = false
                          }
                        field.onChange(input)
                        }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={'true'}>Sim</SelectItem>
                          <SelectItem value={'false'}>Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="isOffice"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>O usuário trabalha no expediente?</FormLabel>

                    <FormControl>
                      <Select
                      defaultValue={String(field.value)}
                      
                      onValueChange={(e)=>{
                        var input
                        if(e === 'true'){
                          input = true}
                          if(e === 'false'){
                            input = false
                          }
                        field.onChange(input)
                        }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={'true'}>Sim</SelectItem>
                          <SelectItem value={'false'}>Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
  
          
          <Button className='w-full' type="submit">Atualizar usuário</Button>
        </form>
        </Form>
            </CardContent>
        </Card>
       
    )
}