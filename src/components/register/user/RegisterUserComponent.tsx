'use client';
import image from "@/src/assets/loginImage.jpg"
import { UseFormSetValue, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { ErrorTypes, registerUserSchema ,RegisterUserValues} from '../../../types';
import { Input } from '@/src/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import Image from 'next/image';
import {generateUniqueKey } from "../../../lib/utils";
import { useToast } from "../../ui/use-toast";
import { Separator } from "../../ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";
import { Function, User } from "@prisma/client";
import { registerUser } from "@/src/app/cadastrarUsuario/actions";
import { signInOnServerActions } from "@/src/app/login/_actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterUserProps{
    departments: {
        id:string,
        name:string
    }[]
}

export function RegisterUserComponent( {departments}:RegisterUserProps){
  const router = useRouter()
  const [isLoading,setIsLoading] = useState(false);

    const {toast} = useToast();

    const onSubmit = async(data:RegisterUserValues) => {
        setIsLoading(true);
  
        const result = await registerUser(data);
        if(!result){
          toast({
            title: "Erro ao cadastrar usuário",
            description: "Verifique os dados e tente novamente.",
          })
        }
        if("code" in result){
          toast({
            title: "Erro ao cadastrar usuário",
            description: (result as ErrorTypes).message,
          })
          return null
        }
        if(result.id){
            toast({
                title: "Usuário cadastrado com sucesso",
                description: "O usuário foi cadastrado com sucesso. VocÊ será redirecionado em breve.",
            })
            if(!result.password){
              toast({
                title: "Usuário cadastrado com sucesso",
                description: "O usuário foi cadastrado com sucesso. VocÊ será redirecionado em breve.",
            })
          return null

            }
            
            try{
              await signInOnServerActions({
                email:result.email,
                password: result.password
            })
            router.push("/")
          
          }
            catch(error){
                toast({
                    title: "Erro ao logar",
                    description: "Ocorreu um erro ao logar o usuário. Tente novamente.",
                })
            }
        }
        setIsLoading(false);

    };

    
    const form = useForm<RegisterUserValues>({
      resolver: zodResolver(registerUserSchema),
      defaultValues: {
        email: "",
        password: "",
        departmentId: "",
        function: "",
        name: "",
      },
    });
    return(

        <div className="relative grid grid-cols-[1fr_1fr] min-h-screen w-full">
          <div className={`relative flex-1 overflow-hidden block sm:hidden md:block lg:block xl:block  w-full`}>
          <Image
            alt="Authentication Hero"
            className={`h-full w-full object-cover object-center`}
            height="800"
            src={image}
            style={{
              aspectRatio: "1200/800",
              objectFit: "cover",
            }}
            width="600"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent`} />
          <div className={`absolute inset-0 flex items-center justify-center px-4 text-center`}>
            <div className={`max-w-xl space-y-4`}>
              <h1 className={`text-4xl font-bold tracking-tighter text-zinc-300 bg-clip-text bg-black border-collapse shadow-inherit sm:text-5xl md:text-6xl`}>
                Shift App
              </h1>
              <p className={`text-lg text-gray-300 md:text-xl bg-clip-text bg-black border-collapse`}>
                Solução de turnos para controladores de voo.
              </p>
            </div>
          </div>
        </div>
        <div className='w-full flex flex-col gap-5 items-center justify-center'>
        <div className="max-w-md w-full space-y-6 px-4 md:px-0">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Aqui você cadastra seu Órgão ATS!</h1>
            <p className="text-gray-500 dark:text-gray-400">Coloque os dados do seu Órgão e crie o usuário ADM.</p>
          </div>
          </div>
          <div className='container w-full lg:w-1/2 mx-auto'>

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
        <h1 className="text-3xl font-bold">Seus dados</h1>
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu nome</FormLabel>
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
              <FormLabel>Seu Email</FormLabel>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sua Senha</FormLabel>
              <FormControl>
                <Input type= "password" placeholder="Senha secreta" {...field} 
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Escolha um órgão registrado"    />
  </SelectTrigger>
  <SelectContent>
    {departments.map(department=>(<SelectItem  key={generateUniqueKey()} value={department.id}>{department.name}</SelectItem>))}
  </SelectContent>
</Select>
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
    <SelectValue placeholder="OPE"  />
  </SelectTrigger>
  <SelectContent>

    {
        Object.keys(Function).map(key=>(<SelectItem key={generateUniqueKey()} value={key}>{key}</SelectItem>))
    }
  </SelectContent>
</Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        

        
        <Button disabled={isLoading} className='w-full' type="submit">Fazer Cadastro</Button>
      </form>
      </Form>
          </div>
            </div>
        </div>
    )
}