'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/src/components/ui/form';

import { toast } from '@/src/components/ui/use-toast';
import { Button } from '../../ui/button';
import { generateUniqueKey } from '@/src/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '../../ui/card';
import { Shift } from '@prisma/client';


const FormSchema = z.object({
  language: z.string({
    required_error: 'Please select a language.'
  })
});

type RegisterWorkDayFormProps = {
    absences:Shift[]
    shifts:Shift[]
};


export function RegisterWorkDayForm(  {absences, shifts}: RegisterWorkDayFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Tabs defaultValue="shift" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shift">Turnos</TabsTrigger>
            <TabsTrigger value="absence">Afastamentos</TabsTrigger>
          </TabsList>
          <TabsContent value="shift">
            <Card>
              <CardHeader>
                <CardTitle>Turno</CardTitle>
                <CardDescription>Selecione um turno de serviço.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Selecione um turno..." />
                            </SelectTrigger>
                            <SelectContent>
                              {shifts.map((shift) => (
                                <SelectItem
                                  key={generateUniqueKey()}
                                  value={shift.id}
                                >
                                  {shift.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="absence">
            <Card>
              <CardHeader>
                <CardTitle>Afastamentos</CardTitle>
                <CardDescription>Selecione seu afastamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Selecione um afastamento..." />
                            </SelectTrigger>
                            <SelectContent>
                              {absences.map((absence) => (
                                <SelectItem
                                  key={generateUniqueKey()}
                                  value={absence.id}
                                >
                                  {absence.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
