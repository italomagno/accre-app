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
import { CreateShiftValues, createShiftSchema } from '@/src/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '../../ui/input-otp';
import { createShift } from './action';

export function CreateShiftComponent() {
  const { toast } = useToast();
  const form = useForm<CreateShiftValues>({
    resolver: zodResolver(createShiftSchema)
  });

  async function onSubmit(data: CreateShiftValues) {
    const result = await createShift(data);
    if ('code' in result && result.code !== 200) {
      toast({
        title: 'Erro',
        description: result.message
      });
      return;
    }
    toast({
      title: 'Sucesso!',
      description: "Turno criado com sucesso!"
    });
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Criar Turno de Serviço</CardTitle>
        <CardDescription>Preencha os dados do turno.</CardDescription>
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
                        <FormLabel>Nome do Turno</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do Turno" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Quantidade desse Turno em um Dia</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Quantidade de Turno por dia"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="minQuantity"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      Quantidade mínima necessária desse Turno em um Dia
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Minimo de turnos por dia"
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
              name="dateStartEnd.start"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Horário de início do turno</FormLabel>
                    <FormDescription>
                      O horário deve ser no formato 24h. Ex: 00:00
                    </FormDescription>
                    <FormControl>
                    <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <div className="flex flex-col">
                          <InputOTPSeparator />
                          <InputOTPSeparator />
                        </div>
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="dateStartEnd.end"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Horário de término do turno</FormLabel>
                    <FormDescription>
                      O horário deve ser no formato 24h. Ex: 00:00
                    </FormDescription>
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <div className="flex flex-col">
                          <InputOTPSeparator />
                          <InputOTPSeparator />
                        </div>
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="isOnlyToSup"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>O turno passa para o dia seguinte?</FormLabel>
                    <FormControl>
                      <Select onValueChange={(e)=>{
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
              name="dateStartEnd.isNextDay"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Esse turno está disponível apenas para supervisores?</FormLabel>
                    <FormControl>
                      <Select onValueChange={(e)=>{
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
              name="isAbscence"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>O Turno é um afastamento?</FormLabel>
                    <FormControl>
                      <Select onValueChange={(e)=>{
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
              name="isAvailable"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>O Turno está disponível?</FormLabel>
                    <FormControl>
                      <Select onValueChange={(e)=>{
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
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Criar turno</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
