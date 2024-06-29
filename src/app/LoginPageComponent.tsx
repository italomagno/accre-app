"use client";

import image from "../assets/loginImage.jpg"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { FormValues, LoginSchema } from '../types';
import { Input } from '@/src/components/ui/input';

import Link from 'next/link';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import Image from 'next/image';
import { signInOnServerActions } from "./login/_actions";
import { LoadingComponentForLoginPage } from "./loadingComponentForLoginPage";
import { useToast } from "../components/ui/use-toast";


export function LoginPageComponent() {
  const {toast} = useToast();

  const onSubmit = async (data: FormValues) => {
    const result = await signInOnServerActions(data);
    if (result.code === 200) {
      showToast("Login efetuado com sucesso", "Aguarde Redirecionamento");
    } else {
      showToast("Erro ao fazer login", result.message);
    }
  };

  const showToast = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
    });
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
       
        <div className="relative grid grid-cols-[1fr_1fr] min-h-screen w-full">
          {form.formState.isLoading && <LoadingComponentForLoginPage/>}
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
            <h1 className="text-3xl font-bold">Bem vindo de Volta!</h1>
            <p className="text-gray-500 dark:text-gray-400">Coloque seu CPF e Saram para acessar sua escala.</p>
          </div>
          </div>
          <div className='container w-full lg:w-1/2 mx-auto'>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="3spadrão@gmail.com" {...field} 
                />
              </FormControl>
              <FormDescription>
                Seu Email
              </FormDescription>
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
              <FormControl
              >
                <Input type= "password" placeholder="Senha Secreta" {...field} />
              </FormControl>
              <FormDescription>
                Sua Senha
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} className='w-full' type="submit">Fazer Login</Button>
      </form>
      </Form>
          </div>
              
              <div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                Não está cadastrado?
                <Link href="/cadastrarUsuario" className="ml-2 font-medium text-gray-900 hover:underline dark:text-gray-50" prefetch={false}>
                  Clique aqui.
                </Link>
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Orgão sem Cadastro?
                <Link href="/cadastrarOrgao" className="ml-2 font-medium text-gray-900 hover:underline dark:text-gray-50" prefetch={false}>
                  Registre-se!
                </Link>
              </p>
              </div>
              
            </div>
        </div>
    
        
    
  )
}