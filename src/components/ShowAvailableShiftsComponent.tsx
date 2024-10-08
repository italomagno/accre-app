"use client"
import { generateUniqueKey } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { getAvailableShiftsDay } from "../app/lancamento/action";
import { useToast } from "./ui/use-toast";
import { Badge } from "./ui/badge";
import { AvailableShifts } from "../types";
import { ShowAvailableShiftsComponentLoading } from "../app/LoadingSkeleton";


type ShowAvailableShiftsComponentProps = {
  day: Date
}

export function ShowAvailableShiftsComponent( {day}: ShowAvailableShiftsComponentProps){
  const {toast} = useToast()
  const [shifts, setShifts] = useState<AvailableShifts>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    async function handleFechShifts(day:Date){
      const response = await getAvailableShiftsDay(day)
      if(!("code" in response)){
       
        setShifts(response)
      }

      if("code" in response)
      toast({
        title: "Erro",
        description: response.message
      })
    }
    handleFechShifts(day)
  }, [day,shifts]);


    return (
        <div className="w-full grid grid-cols-2 gap-2">
          {
            shifts ?
            shifts.map((shift) => (
              <Card key={generateUniqueKey()} className="w-full">
                <CardHeader>
                  <CardTitle>{shift.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  {
                  shift.shifts.map((availableShift) => (
                    <Badge
                      className="flex flex-col text-base lg:text-xl text-nowrap"
                      key={generateUniqueKey()}
                    >
                      {`${availableShift.shift.name}(${availableShift.count})`}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
              ))
            : <ShowAvailableShiftsComponentLoading/>
            
          }
          </div>
    )
}