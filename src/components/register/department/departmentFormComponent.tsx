'use client';
import image from "@/src/assets/loginImage.jpg"
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { CreateDepartmentAndUserValues, createManyUsersSchema} from '@/src/types';
import { Input } from '@/src/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import Image from 'next/image';
import {  DepartmentClassification, DepartmentTypes} from "@prisma/client";
import { useToast } from "@/src/components/ui/use-toast";
import { createDepartment } from "@/src/app/cadastrarOrgao/actions";
import { Separator } from "@/src/components/ui/separator";
import {  useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { generateUniqueKey } from "@/src/lib/utils";


export function DepartmentFormComponent() {
  const {toast} = useToast();
  const router = useRouter()
  


  const onSubmit = async(data:CreateDepartmentAndUserValues) => {
   

    //criar função para cadastrar o usuário no departamento
    const result = await createDepartment(data);

    if(result){
      if("code" in result){
        toast({
          title: "Erro ao cadastrar Órgão",
          description: result.message,
        })
        
        return;
      }

      toast({title: "Órgão cadastrado com sucesso!", 
      description: "Agora você pode acessar o ShiftApp com o usuário criado."
        });
        router.push("/login");
      
    }else{

      toast({
        title: "Erro ao cadastrar Órgão",
        description: "Verifique os dados e tente novamente.",
      })
      
      return;
    }

    

  };
 
  const form = useForm<CreateDepartmentAndUserValues>({
    resolver: zodResolver(createManyUsersSchema),
    defaultValues: {
      departmentName: "",
      email: "",
      password: "",
      name: "",
    },
  });
  return (
       
        <div className="relative grid grid-cols-[1fr_1fr] min-h-screen w-full">
          {/* isSubmitted && <LoadingComponentForLoginPage/> */}
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual o tipo do Órgão</FormLabel>
                <FormControl>
                <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha o tipo do órgão..." />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(DepartmentTypes).map((type) => (
                                <SelectItem
                                  key={generateUniqueKey()}
                                  value={type}
                                >
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual a classificação do Órgão</FormLabel>
                <FormControl>
                <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha o tipo do órgão..." />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(DepartmentClassification).map((classification) => (
                                <SelectItem
                                  key={generateUniqueKey()}
                                  value={classification}
                                >
                                  {classification}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type= "password" placeholder="senha secreta" {...field} 
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      

      
        <Button disabled={form.formState.isSubmitting} className='w-full' type="submit">Fazer Cadastro</Button>
      </form>
      </Form>
          </div>
            </div>
        </div>
    
        
    
  )
}