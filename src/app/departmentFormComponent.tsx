import image from "../assets/loginImage.jpg"
import { UseFormSetValue, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { FormValues, registerDepartmentSchema ,RegisterDepartmentValues} from '../types';
import { Input } from '@/src/components/ui/input';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import Image from 'next/image';
import { signInOnServerActions } from "./login/_actions";
import { LoadingComponentForLoginPage } from "./loadingComponentForLoginPage";
import { applyCpfMask, applySaramMask } from "../lib/utils";
import { Separator } from "../components/ui/separator";


export function DepartmentFormComponent() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async(data:FormValues) => {
    setIsSubmitted(true)
    //criar função para cadastrar o departamento

      

    //criar função para cadastrar o usuário no departamento

    const result = await signInOnServerActions(data);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maskFunction: (value: string) => string,
    fieldName: keyof FormValues,
    setValue: UseFormSetValue<{
      CPF: string;
      saram: string;
      departmentName: string;
      spreadSheetId: string;
      email: string;
      name: string;
  }>
  ) => {
    const value = e.target.value;
    const maskedValue = maskFunction ? maskFunction(value) : value;
    setValue(fieldName, maskedValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const form = useForm<RegisterDepartmentValues>({
    resolver: zodResolver(registerDepartmentSchema),
    defaultValues: {
      CPF: "",
      saram: "",
      departmentName: "",
      spreadSheetId: "",
      email: "",
      name: "",
    },
  });

  return (
       
        <div className="relative grid grid-cols-[1fr_1fr] min-h-screen w-full">
          {isSubmitted && <LoadingComponentForLoginPage/>}
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
        <h1 className="text-3xl font-bold">Dados do Órgão</h1>
        </div>
        
        <FormField
          control={form.control}
          name="departmentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Órgão</FormLabel>
                <FormControl>
                <Input placeholder="Acc-Re" {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="spreadSheetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Planilha do Google Sheets para registro de turnos.</FormLabel>
                <FormControl>
                  <Input placeholder="https://docs.google.com/spreadsheets/d/1FUnkFWH95vb6EpomOAYxGyVHmdeovqOus28FwP3xDvs/edit?gid=0#gid=0" {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <Separator/>
        <div>
         <h1 className="text-3xl font-bold">Dados do Moderador</h1>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do militar</FormLabel>
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
          name="CPF"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cpf</FormLabel>
              <FormControl>
                <Input placeholder="xxx.xxx.xxx-xx" {...field} 
                onChange={(e) => handleChange(e, applyCpfMask,"CPF", form.setValue)}
                />
              </FormControl>

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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitted} className='w-full' type="submit">Fazer Login</Button>
      </form>
      </Form>
          </div>
              
      
              
            </div>
        </div>
    
        
    
  )
}