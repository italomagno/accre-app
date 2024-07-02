'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../ui/use-toast';
import {  UpdateMyAccountValues, updateMyAccountSchema } from '@/src/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../ui/form';

import { updateMyAccount } from '@/src/app/settings/users/createUser/actions';

type UpdateMyAccountComponentProps = {
  id: string;
  defaultUserValues: UpdateMyAccountValues;
}

export function UpdateMyAccountComponent({ defaultUserValues,id }: UpdateMyAccountComponentProps) {
  const { toast } = useToast();
  const form = useForm<UpdateMyAccountValues>({
    resolver: zodResolver(updateMyAccountSchema),defaultValues: defaultUserValues
  })

  async function onSubmit(data: UpdateMyAccountValues) {
    const result = await updateMyAccount(id,data);
    console.log(result)
    if ('code' in result && result.code !== 200) {
      toast({
        title: 'Erro',
        description: result.message
      });
    }
    toast({
      title: 'Sucesso!',
      description: "Usuário atualizado com sucesso!"
    });
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Editar Usuário</CardTitle>
        <CardDescription>Preencha os dados do usuário.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full justify-evenly gap-4"
          >
            <div className="flex w-full justify-evenly gap-4">
              <div className="w-full flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Nome do Usuário</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email:</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email do usuário"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
              </div>
            </div>
            <FormField
              control={form.control}
              name="function"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      Posição Operacional do Usuário
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={true}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EST">EST</SelectItem>
                          <SelectItem value="OPE">OPE</SelectItem>
                          <SelectItem value="COR">COR</SelectItem>
                          <SelectItem value="INST">INST</SelectItem>
                          <SelectItem value="SUP">SUP</SelectItem>
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
                    <Select  defaultValue={String(field.value)} disabled={true} onValueChange={(e)=>{
                        var input
                        if(e === 'true'){
                          input = true}
                          if(e === 'false'){
                            input = false
                          }
                        field.onChange(input)
                        }
                      }>
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
              name="block_changes"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Bloquear trocas do usuário?</FormLabel>
                    <FormControl>
                      <Select  defaultValue={String(field.value)} disabled={true} onValueChange={(e)=>{
                        var input
                        if(e === 'true'){
                          input = true}
                          if(e === 'false'){
                            input = false
                          }
                        field.onChange(input)
                        }
                      }>
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
          
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Atualizar Usuário</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
