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
import { UpdateRosterValues, UpdateRosterSchema } from '@/src/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../ui/form';

import { generateUniqueKey } from '@/src/lib/utils';
import { Months } from '@prisma/client';
import { updateRoster } from '@/src/app/settings/roster/createRoster/action';

type UpdateRosterComponentProps = {
  id: string;
  defaultRosterValues: UpdateRosterValues;
}

export function UpdateRosterComponent({ defaultRosterValues,id }: UpdateRosterComponentProps) {
  const { toast } = useToast();
  const form = useForm<UpdateRosterValues>({
    resolver: zodResolver(UpdateRosterSchema),defaultValues: defaultRosterValues
  })

  async function onSubmit(data: UpdateRosterValues) {
    const result = await updateRoster(id,data);
    if ('code' in result && result.code !== 200) {
      toast({
        title: 'Erro',
        description: result.message
      });
    }
    toast({
      title: 'Sucesso!',
      description: "Escala atualizada com sucesso!"
    });
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Editar Escala de Serviço</CardTitle>
        <CardDescription>Preencha os dados da Escala.</CardDescription>
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
                  name="month"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Mês</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha o mês..." />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(Months).map((month) => (
                                <SelectItem
                                  key={generateUniqueKey()}
                                  value={month}
                                >
                                  {month}
                                </SelectItem>
                              ))}
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
                  name="year"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Ano</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha o ano..." />
                            </SelectTrigger>
                            <SelectContent>
                              {[2024, 2025, 2026, 2027, 2028, 2029].map(
                                (year) => (
                                  <SelectItem
                                    key={generateUniqueKey()}
                                    value={String(year)}
                                  >
                                    {year}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
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
              name="minWorkingHoursPerRoster"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Minimo de horas por controlador</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Minimo de horas por controlador"
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
              name="maxWorkingHoursPerRoster"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Máximo de horas por controlador</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Máximo de horas por controlador"
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
              name="blockChanges"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Blockear essa escala para Proposição?</FormLabel>

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
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Atualizar Turno</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
