"use client";



import image from "../assets/loginImage.jpg"
import { UseFormSetValue, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { FormValues, LoginSchema } from '../types';
import { Input } from '@/src/components/ui/input';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/src/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import Image from 'next/image';
import { signInOnServerActions } from "./login/_actions";


export function LoginPageComponent() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false);

   function applyCpfMask(value: string): string {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
  
   function applySaramMask(value: string): string {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{6})(\d)/, '$1-$2')
      .replace(/(-\d)\d+?$/, '$1');
  }
   async function handleSubmitForm (values: FormValues){
  
   /*  if (response && response.ok === false) {
      toast({
      title: 'Pau no login!',
      description: "Verifique seu CPF ou Saram.",
      duration: 3000,

      })
    }
    if (response && response.ok === true) {
      toast({
      title: 'Login realizado com sucesso!',
      description: "Aguarde redirecionamento.",
      duration: 3000,

      })
        router.push('/lancamento')
    }
   
    setTimeout(() => {
      handleFinishSubmit()
    }, 3000); */
}
function handleFinishSubmit(){
  setIsSubmitted(false);
}

  const onSubmit = async(data:FormValues) => {
    setIsSubmitted(true)
    const result = await signInOnServerActions(data);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maskFunction: (value: string) => string,
    fieldName: keyof FormValues,
    setValue: UseFormSetValue<{
      CPF: string;
      saram: string;
  }>
  ) => {
    const value = e.target.value;
    const maskedValue = maskFunction ? maskFunction(value) : value;
    setValue(fieldName, maskedValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  //TypeError: Cannot read properties of undefined (reading 'parseAsync')
  const form = useForm<FormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      CPF: "",
      saram: "",
    },

  });

  return (
       
        <div className="grid grid-cols-[1fr_1fr] min-h-screen w-full">
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
          name="CPF"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cpf</FormLabel>
              <FormControl>
                <Input placeholder="xxx.xxx.xxx-xx" {...field} 
                onChange={(e) => handleChange(e, applyCpfMask,"CPF", form.setValue)}
                />
              </FormControl>
              <FormDescription>
                Seu Cpf
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="saram"
          render={({ field}) => (
            <FormItem>
              <FormLabel>Saram</FormLabel>
              <FormControl
              >
                <Input placeholder="xxxxxx-x" {...field} 
                onChange={(e) => handleChange(e, applySaramMask,"saram", form.setValue)}
                />
              </FormControl>
              <FormDescription>
                Seu Saram
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitted} className='w-full' type="submit">Fazer Login</Button>
      </form>
      </Form>
          </div>
              
              <div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                Não está cadastrado?
                <Link href="#" className="ml-2 font-medium text-gray-900 hover:underline dark:text-gray-50" prefetch={false}>
                  Clique aqui.
                </Link>
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Orgão sem Cadastro?
                <Link href="#" className="ml-2 font-medium text-gray-900 hover:underline dark:text-gray-50" prefetch={false}>
                  Registre-se!
                </Link>
              </p>
              </div>
              
            </div>
        </div>
    
        
    
  )
}