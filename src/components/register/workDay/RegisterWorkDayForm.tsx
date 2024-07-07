'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { Shift, WorkDay } from '@prisma/client';
import { useEffect, useState } from 'react';
import { getShiftsAndAbscence } from '@/src/app/settings/shifts/action';
import {
  RegisterOrUpdateValues,
  checkIfTwoShiftsHasEightHoursOfRestBetweenThem,
  registerOrUpdateSchema
} from '@/src/validations';
import { registerOrUpdateWorkDay } from './action';
import { useRouter } from 'next/navigation';

type RegisterWorkDayFormProps = {
  workDay: WorkDay | undefined;
  day:Date
};

export function RegisterWorkDayForm({ workDay ,day}: RegisterWorkDayFormProps) {
  const router = useRouter();

  const form = useForm<RegisterOrUpdateValues>({
    resolver: zodResolver(registerOrUpdateSchema),defaultValues:{
      shiftId1: workDay?.shiftsId[0] ?? '0',
      shiftId2: workDay?.shiftsId[1] ?? '0'
    }
  });
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [absences, setAbsences] = useState<Shift[]>([]);
  const [shifts2, setShifts2] = useState<Shift[]>([]);

  async function onSubmitData(data: RegisterOrUpdateValues) {
    const newData = {
      ...data,
      day,
      workdayId: workDay?.id
    };

    const response = await registerOrUpdateWorkDay(newData);
    if ('code' in response && response.code !== 200) {
      toast({
        title: 'Erro',
        description: response.message
      });
    router.refresh();

    } else {
      toast({
        title: 'Sucesso',
        description: response.message
      });
    }
  }

  async function fetchAvailableShifts() {
    try {
      const result = await getShiftsAndAbscence();
      if ('code' in result) {
        toast({
          title: 'Erro',
          description: result.message
        });
        return;
      }
      const { shifts, absences } = result;
      if (!shifts || !absences) {
        toast({
          title: 'Erro',
          description: 'Nenhum turno ou afastamento disponível'
        });
        return;
      }

      setShifts(shifts);
      setAbsences(absences);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAvailableShifts();
    if(workDay){
      form.setValue('shiftId1', workDay.shiftsId[0]);
    }
  }, []);

  useEffect(() => {
    if (form.watch('shiftId1') !== '0') {
      const shift1 = shifts.find(
        (shift) => shift.id === form.getValues("shiftId1")
      );
      if (!shift1) return;
      const shiftsWithEightHoursOfRestFromShift1 = shifts.filter(
        (shift) =>
          checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1, shift) &&
          !shift.isAbscence
      );
      const shiftsAvailableWithAbscence =
        shiftsWithEightHoursOfRestFromShift1.filter(
          (shift) => shift.isAbscence
        );
      setShifts2([
        ...shiftsWithEightHoursOfRestFromShift1,
        ...shiftsAvailableWithAbscence
      ]);
    }
  }, [form.watch('shiftId1')]);

  return (
    <Tabs defaultValue="shift">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="shift">Turnos</TabsTrigger>
        <TabsTrigger value="absence">Afastamentos</TabsTrigger>
      </TabsList>
      <TabsContent value="shift">
        <Card>
          <CardHeader>
            <CardTitle>Turno</CardTitle>
            <CardDescription>Selecione um turno de serviço.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <Form {...form}>
            <form
              className="flex flex-col gap-3 w-full"
            >
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="shiftId1"
                    render={({ field }) => (
                      <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                        <FormControl onMouseDown={e=>e.stopPropagation()}>
                            <SelectTrigger>
                              <SelectValue  placeholder="Selecione um turno..." />
                            </SelectTrigger>
                        </FormControl>
                            <SelectContent>

                              <SelectItem  value={'0'}>{'Sem turno'}</SelectItem>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch('shiftId1') &&
                    form.watch('shiftId1') !== '0' &&
                    shifts2.length > 0 && (
                      <FormField
                        control={form.control}
                        name="shiftId2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Selecione um turno..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem onSelect={(e)=>e.stopPropagation()} value={'0'}>
                                    {'Sem turno'}
                                  </SelectItem>
                                  {shifts2.map((shift) => (
                                    <SelectItem
                                    onSelect={(e)=>e.stopPropagation()}
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
                    )}
                </div>
           

              <CardFooter>
                <Button
                onClick={(e) => {
                  onSubmitData(form.getValues())
                }
                }
                  type="submit"
                  className="w-full"
                >
                  Salvar turno
                </Button>
              </CardFooter>
            </form>
          </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="absence">
        <Card>
          <CardHeader>
            <CardTitle>Afastamentos</CardTitle>
            <CardDescription>Selecione seu afastamento</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitData)}
              className="flex flex-col gap-3 w-full"
            >
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="shiftId1"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um afastamento..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={'0'}>
                                {'Sem afastamento'}
                              </SelectItem>
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
                <Button
                  type="submit"
                  className="w-full"
                >
                  Salvar Afastamento
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
