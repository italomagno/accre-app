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
import { RegisterOrUpdateValues, checkIfTwoShiftsHasEightHoursOfRestBetweenThem, registerOrUpdateSchema } from '@/src/validations';
import { registerOrUpdateWorkDay } from './action';


type RegisterWorkDayFormProps = {
  workDay: WorkDay;
}


/* export function RegisterWorkDayForm({workDay}:RegisterWorkDayFormProps) {
  const form = useForm<RegisterOrUpdateValues>({
    resolver: zodResolver(registerOrUpdateSchema)
  });
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [absences, setAbsences] = useState<Shift[]>([]);
  const [shifts2, setShifts2] = useState<Shift[]>([]);

  async function onSubmit(data: RegisterOrUpdateValues) {
    console.log(data)
    const newData = {
      ...data,
      workdayId: workDay.id
    }

    const response = await registerOrUpdateWorkDay(newData);
    if("code" in response && response.code !== 200){
      toast({
        title: "Erro",
        description: response.message
      }) 
    }
    toast({
      title: "Sucesso",
      description: response.message
    })

  }
  async function fetchAvailableShifts() {
    try {
      const result = await getShiftsAndAbscence();
      if("code" in result){
        toast(
          {
            title: "Erro",
            description: result.message
          } 
        )
        return
     
      }
      const { shifts, absences } = result;
      if(!shifts || !absences){
        toast({
          title: "Erro",
          description: "Nenhum turno ou afastamento disponível"
        })
        return
      }

      setShifts(shifts);
      setAbsences(absences);
    } catch (error) {
      console.error(error);
    }
  }

  
  useEffect(() => {
 fetchAvailableShifts()
  }, [])

  useEffect(() => {
    if(form.getValues('shiftId1') !== '0'){
      const shift1 = shifts.find(shift => shift.id === form.getValues('shiftId1'))
      if(!shift1) return
      const shiftsWithEightHoursOfRestFromShift1 = shifts.filter(shift => checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1, shift) && shift.isAbscence === false)
      const shiftsAvailableWithAbscence = shiftsWithEightHoursOfRestFromShift1.filter(shift => shift.isAbscence === true)
      setShifts2([...shiftsWithEightHoursOfRestFromShift1,...shiftsAvailableWithAbscence])
    }
  },[form.getValues('shiftId1')])

  return (
    <Form {...form}>
      <form onSubmit={(e)=>{
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
        } className='flex flex-col gap-3 w-full' >
        <Tabs defaultValue="shift" >
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
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="shiftId1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={(e)=>field.onChange(e)}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Selecione um turno..." />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem
                                  value={"0"}
                                >
                                  {"Sem turno"}
                                </SelectItem>
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
                {
                  form.getValues('shiftId1') && form.getValues('shiftId1') !== '0' && shifts2.length > 0 && (
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
                              <SelectItem
                                  value={"0"}
                                >
                                  {"Sem turno"}
                                </SelectItem>
                                {shifts2.map((shift) => (
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
                  )
                }
                </div>
              </CardContent>
              <CardFooter>
              <Button disabled={form.formState.isSubmitting} type='submit' className='w-full'>Salvar turno</Button>
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
                    name="shiftId1"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger >
                              <SelectValue placeholder="Selecione um afastamento..." />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem
                                  value={"0"}
                                >
                                  {"Sem afastamento"}
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
                <Button  disabled={form.formState.isSubmitting} type='submit' className='w-full'>Salvar Afastamento</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <div className='py-3 w-full'>
        </div>
      </form>
    </Form>
  );
} */

/* 
  export function RegisterWorkDayForm({ workDay }: RegisterWorkDayFormProps) {
    const form = useForm<RegisterOrUpdateValues>({
      resolver: zodResolver(registerOrUpdateSchema)
    });
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [absences, setAbsences] = useState<Shift[]>([]);
    const [shifts2, setShifts2] = useState<Shift[]>([]);
  
    async function onSubmit(data: RegisterOrUpdateValues) {
      console.log('Form submitted with data:', data); // Print form data to console
      const newData = {
        ...data,
        workdayId: workDay.id
      };
  
      const response = await registerOrUpdateWorkDay(newData);
      if ("code" in response && response.code !== 200) {
        toast({
          title: "Erro",
          description: response.message
        });
      } else {
        toast({
          title: "Sucesso",
          description: response.message
        });
      }
    }
  
    async function fetchAvailableShifts() {
      try {
        const result = await getShiftsAndAbscence();
        if ("code" in result) {
          toast({
            title: "Erro",
            description: result.message
          });
          return;
        }
        const { shifts, absences } = result;
        if (!shifts || !absences) {
          toast({
            title: "Erro",
            description: "Nenhum turno ou afastamento disponível"
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
    }, []);
  
    useEffect(() => {
      if (form.getValues('shiftId1') !== '0') {
        const shift1 = shifts.find(shift => shift.id === form.getValues('shiftId1'));
        if (!shift1) return;
        const shiftsWithEightHoursOfRestFromShift1 = shifts.filter(shift => checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1, shift) && !shift.isAbscence);
        const shiftsAvailableWithAbscence = shiftsWithEightHoursOfRestFromShift1.filter(shift => shift.isAbscence);
        setShifts2([...shiftsWithEightHoursOfRestFromShift1, ...shiftsAvailableWithAbscence]);
      }
    }, [form.getValues('shiftId1')]);
  
    return (
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submission prevented, manually handling submission');
            const formData = form.getValues();
            form.handleSubmit(async()=>await onSubmit(formData))(); // Manually handle form submission
          }}
          className='flex flex-col gap-3 w-full'
        >
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
                  <div className="space-y-1">
                    <FormField
                      control={form.control}
                      name="shiftId1"
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
                                <SelectItem value={"0"}>{"Sem turno"}</SelectItem>
                                {shifts.map((shift) => (
                                  <SelectItem key={generateUniqueKey()} value={shift.id}>
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
                    {
                      form.getValues('shiftId1') && form.getValues('shiftId1') !== '0' && shifts2.length > 0 && (
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
                                    <SelectItem value={"0"}>{"Sem turno"}</SelectItem>
                                    {shifts2.map((shift) => (
                                      <SelectItem key={generateUniqueKey()} value={shift.id}>
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
                      )
                    }
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={form.formState.isSubmitting} type='submit' className='w-full'>Salvar turno</Button>
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
                                <SelectItem value={"0"}>{"Sem afastamento"}</SelectItem>
                                {absences.map((absence) => (
                                  <SelectItem key={generateUniqueKey()} value={absence.id}>
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
                  <Button disabled={form.formState.isSubmitting} type='submit' className='w-full'>Salvar Afastamento</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          <div className='py-3 w-full'></div>
        </form>
      </Form>
    );
  } */

    export function RegisterWorkDayForm({ workDay }: RegisterWorkDayFormProps) {
      const form = useForm<RegisterOrUpdateValues>({
        resolver: zodResolver(registerOrUpdateSchema)
      });
      const [shifts, setShifts] = useState<Shift[]>([]);
      const [absences, setAbsences] = useState<Shift[]>([]);
      const [shifts2, setShifts2] = useState<Shift[]>([]);
    
      async function onSubmit(data: RegisterOrUpdateValues) {
        console.log('Form submitted with data:', data); // Print form data to console
        const newData = {
          ...data,
          workdayId: workDay.id
        };
    
        const response = await registerOrUpdateWorkDay(newData);
        if ("code" in response && response.code !== 200) {
          toast({
            title: "Erro",
            description: response.message
          });
        } else {
          toast({
            title: "Sucesso",
            description: response.message
          });
        }
      }
    
      async function fetchAvailableShifts() {
        try {
          const result = await getShiftsAndAbscence();
          if ("code" in result) {
            toast({
              title: "Erro",
              description: result.message
            });
            return;
          }
          const { shifts, absences } = result;
          if (!shifts || !absences) {
            toast({
              title: "Erro",
              description: "Nenhum turno ou afastamento disponível"
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
      }, []);
    
      useEffect(() => {
        if (form.watch('shiftId1') !== '0') {
          const shift1 = shifts.find(shift => shift.id === form.watch('shiftId1'));
          if (!shift1) return;
          const shiftsWithEightHoursOfRestFromShift1 = shifts.filter(shift => checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1, shift) && !shift.isAbscence);
          const shiftsAvailableWithAbscence = shiftsWithEightHoursOfRestFromShift1.filter(shift => shift.isAbscence);
          setShifts2([...shiftsWithEightHoursOfRestFromShift1, ...shiftsAvailableWithAbscence]);
        }
      }, [form.watch('shiftId1')]);
    
      return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-3 w-full'
          >
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
                    <div className="space-y-1">
                      <FormField
                        control={form.control}
                        name="shiftId1"
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
                                  <SelectItem value={"0"}>{"Sem turno"}</SelectItem>
                                  {shifts.map((shift) => (
                                    <SelectItem key={generateUniqueKey()} value={shift.id}>
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
                      {
                        form.watch('shiftId1') && form.watch('shiftId1') !== '0' && shifts2.length > 0 && (
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
                                      <SelectItem value={"0"}>{"Sem turno"}</SelectItem>
                                      {shifts2.map((shift) => (
                                        <SelectItem key={generateUniqueKey()} value={shift.id}>
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
                        )
                      }
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button disabled={form.formState.isSubmitting} type='submit' className='w-full'>Salvar turno</Button>
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
                                  <SelectItem value={"0"}>{"Sem afastamento"}</SelectItem>
                                  {absences.map((absence) => (
                                    <SelectItem key={generateUniqueKey()} value={absence.id}>
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
                    <Button disabled={form.formState.isSubmitting} type='submit' className='w-full'>Salvar Afastamento</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            <div className='py-3 w-full'></div>
          </form>
        </Form>
      );
    }
    