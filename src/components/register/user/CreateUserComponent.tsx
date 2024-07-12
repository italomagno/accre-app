"use client"

import { registerUser } from "@/src/app/cadastrarUsuario/actions";
import { RegisterUserValues, ErrorTypes, registerUserSchema } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/use-toast";
import {  generateUniqueKey } from "@/src/lib/utils";
import { Separator } from "@/src/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form, FormDescription } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Department, User,Function } from "@prisma/client";
import { UseFormSetValue ,useForm} from "react-hook-form";


interface RegisterUserProps{
    department: Department
}

export function CreateUserComponent( {department}:RegisterUserProps){
          
    const router = useRouter()

    const {toast} = useToast();

    const onSubmit = async(data:RegisterUserValues) => {
        data.departmentId = department.id;
        data.password = "123456789";
        const result = await registerUser(data);
        if(!result){
          toast({
            title: "Erro ao cadastrar usuário",
            description: "Verifique os dados e tente novamente.",
          })
        }
        if((result as ErrorTypes).code){
          toast({
            title: "Erro ao cadastrar usuário",
            description: (result as ErrorTypes).message,
          })
        }
        if((result as User).id){
            toast({
                title: "Usuário cadastrado com sucesso",
                description: "O usuário foi cadastrado com sucesso. VocÊ será redirecionado em breve.",
            })
        }


    };
    const functionHeadingKeys = Object.keys(Function)

   
    const form = useForm<RegisterUserValues>({
      resolver: zodResolver(registerUserSchema),
      defaultValues: {
        departmentId: department.name,
        function: "",
        email: "",
        password: "",
        name: "",
      },
    });


    return(
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
          <h1 className="text-3xl font-bold">Dados do Usuário</h1>
          </div>
          
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
            name="password"
            render={({ field}) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormDescription>Senha padrão: 123456789</FormDescription>
                <FormControl
                >
                  <Input type= "password" placeholder="Senha gerada automaticamente..." {...field} 
                  disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <Separator/>
          <div>
           <h1 className="text-3xl font-bold">Orgão e Função Operacional</h1>
          </div>
          <div className="flex w-full gap-2 justify-evenly items-start">
  
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Órgão ATS</FormLabel>
                <FormControl>
                <Input {...field} 
                disabled={true}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
    <SelectTrigger className="w-[180px]">
      <SelectValue   />
    </SelectTrigger>
    <SelectContent>
  
      {
          functionHeadingKeys.map(key=>(
          <SelectItem key={generateUniqueKey()} value={key}>{key}</SelectItem>
        ))
      }
    </SelectContent>
  </Select>
                </FormControl>
  
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          
  
          
          <Button disabled={form.formState.isSubmitting} className='w-full' type="submit">Fazer Cadastro</Button>
        </form>
        </Form>
    )
}