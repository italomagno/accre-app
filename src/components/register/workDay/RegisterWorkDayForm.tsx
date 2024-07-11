'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
  checkIfTwoShiftsHasEightHoursOfRestBetweenThem,

} from '@/src/validations';


type RegisterWorkDayFormProps = {
  workDay: WorkDay | undefined;
  day:Date
  onWorkDayUpdate: (workDay: WorkDay) => void;
};

export function RegisterWorkDayForm({ workDay,day,onWorkDayUpdate}: RegisterWorkDayFormProps) {
  const [shifts1, setShifts1] = useState<Shift[]>([]);
  const [absences, setAbsences] = useState<Shift[]>([]);
  const [shifts2, setShifts2] = useState<Shift[]>([]);
  const [shiftId1, setShiftId1] = useState<string>("0");
  const [shiftId2, setShiftId2] = useState<string>("0");

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
      const { shifts, absences:abscensesFromRequest } = result;
      if (!shifts || !absences) {
        toast({
          title: 'Erro',
          description: 'Nenhum turno ou afastamento disponível'
        });
        return;
      }

      if(workDay && workDay.shiftsId.length > 0){
        const [shift1,shift2] = workDay.shiftsId
        if(shift1){
          const shift1FromFetch = shifts.find((shift)=>shift.id === shift1)
          if(!shift1FromFetch){
          setShifts1(shifts)
          setAbsences(abscensesFromRequest)
            return
          }
          const AvailableShifts = shifts.filter((shift)=>checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1FromFetch,shift))
          setShifts1(shifts)
          setShiftId1(shift1)
          setShifts2([...AvailableShifts,...abscensesFromRequest])
          if(shift2){
            setShiftId2(shift2)
          }
          return
        }else{
          setShifts1(shifts)
          setAbsences(abscensesFromRequest)
          return
        }
      }else{
        setShifts1(shifts)
        setAbsences(abscensesFromRequest)
      }


    
    } catch (error) {
      console.error(error);
    }
  }
  function handleUpdateWorkDay(e: React.MouseEvent<HTMLButtonElement>){
    e.stopPropagation()
    if(workDay){
      const updatedWorkDay = {
        ...workDay,
        shiftsId: shiftId2 === "0" ? [shiftId1] : [shiftId1,shiftId2],
        day
      }
      onWorkDayUpdate(updatedWorkDay)
    }else{
      const updatedWorkDay = {
        shiftsId: shiftId2 === "0" ? [shiftId1] : [shiftId1,shiftId2],
        day
      }

      onWorkDayUpdate(updatedWorkDay as WorkDay)
    }
  }
  useEffect(() => {
    fetchAvailableShifts();
  }, []);

  useEffect(() => {
    const shift1 = shifts1.find((shift)=>shift.id === shiftId1)
    if(!shift1){
    setShiftId2("0")
      setShifts2([...absences])
      return 
    }
    const newShifts2 = shifts1.filter((shift)=>checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift1,shift))
    setShiftId2("0")
    setShifts2([...newShifts2,...absences])
  }, [shiftId1]);





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
                <div className="space-y-1">
                          <Select
                            onValueChange={e => setShiftId1(e)}
                            defaultValue={shiftId1}
                            value={shiftId1}
                          >
                            <SelectTrigger>
                              <SelectValue  placeholder="Selecione um turno..." />
                            </SelectTrigger>
                            <SelectContent>

                              <SelectItem  value={'0'}>{'Sem turno'}</SelectItem>
                              {shifts1.map((shift) => (
                                <SelectItem
                                  key={generateUniqueKey()}
                                  value={shift.id}
                                >
                                  {shift.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            onValueChange={e=>setShiftId2(e)}
                            defaultValue={shiftId2}
                            value={shiftId2}
                          >
                            <SelectTrigger >
                              <SelectValue placeholder="Selecione um turno..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem  value={'0'}>
                                {'Sem turno'}
                              </SelectItem>
                              {shifts2.length > 0 && shifts2.map((shift) => (
                                <SelectItem
                                  key={generateUniqueKey()}
                                  value={shift.id}
                                >
                                  {shift.name}
                                </SelectItem>
                              ))
                            }
                            </SelectContent>
                          </Select>
                  
                </div>
           

              <CardFooter>
                <Button
                onClick={handleUpdateWorkDay}
                type='submit'
                  className="w-full"
                >
                  Salvar turno
                </Button>
              </CardFooter>
          
          </CardContent>
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
                          <Select
                            onValueChange={e=>setShiftId1(e)}
                            defaultValue={shiftId1}
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

                </div>
              </CardContent>
              <CardFooter>
                <Button
                 type='submit'
                onClick={handleUpdateWorkDay}
                  className="w-full"
                >
                  Salvar Afastamento
                </Button>
              </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
