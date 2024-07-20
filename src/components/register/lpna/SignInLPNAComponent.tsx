"use client";

import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { useRouter } from "next/navigation";
import { useToast } from "../../ui/use-toast";
import { LoginLPNASchema, LoginLPNAValues } from "@/src/types";
import { Checkbox } from "../../ui/checkbox";
import { signInOnLPNA } from '@/src/app/settings/integrations/lpna/actions';
import { useState } from 'react';


export function SignInLPNAComponent() {
  const {toast} = useToast();
  const router = useRouter();
  const [isLoading,setIsLoading] = useState(false);

  const onSubmit = async (data: LoginLPNAValues) => {
    setIsLoading(true);
    const result = await signInOnLPNA(data);
    if ("code" in result && result.code === 200) {
      showToast("Sucesso!", result.message);
      router.push("/settings/integrations/lpna");
    } else {
      showToast("Erro", result.message);
    }
  setIsLoading(false);
  };

  const showToast = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
    });
  };

  const form = useForm<LoginLPNAValues>({
    resolver: zodResolver(LoginLPNASchema),
    defaultValues: {
      email: "",
      password: "",
      savePassword:false
    },
  });

  return (
        <div className='w-full flex flex-col gap-5 items-center justify-center'>
        <div className="max-w-md w-full space-y-6 px-4 md:px-0">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Integração com a LPNA!</h1>
            <p className="text-gray-500 dark:text-gray-400">Coloque suas credenciais para sincronizar dados.</p>
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
                Seu do Escalante
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
                Senha do Escalante
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
                Senha do Escalante
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="savePassword"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Salvar credenciais para um próximo login
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className='w-full' type="submit">Fazer Login</Button>
      </form>
      </Form>
          </div>
              
              
              
            </div>
    
        
    
  )
}