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
import { Months } from '@prisma/client';
import { generateUniqueKey } from '@/src/lib/utils';
import { Label } from '../../ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../ui/use-toast';
import { CreateRosterValues, createRosterSchema } from '@/src/types';
import { createRoster } from '../../../app/settings/roster/createRoster/action';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../ui/form';

export function CreateRosterComponent() {
  const { toast } = useToast();
  const form = useForm<CreateRosterValues>({
    resolver: zodResolver(createRosterSchema)
  });

  async function onSubmit(data: CreateRosterValues) {
    const result = await createRoster(data);
    if ('code' in result && result.code !== 200) {
      toast({
        title: 'Erro ao criar escala operacional',
        description: result.message
      });
      return;
    }
    toast({
      title: 'Escala operacional criada com sucesso!',
      description: 'Agora você pode acessar a escala operacional criada.'
    });
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Criar escala operacional</CardTitle>
        <CardDescription>Preencha os dados da escala.</CardDescription>
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
                          <Select onValueChange={field.onChange}>
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
                          <Select onValueChange={field.onChange}>
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
              name="minHours"
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
              name="maxHours"
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
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Criar escala operacional</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
