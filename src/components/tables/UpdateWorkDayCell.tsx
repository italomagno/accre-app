"use client"

import { TableCell } from "../ui/table";
import { Roster, Shift, User } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { generateUniqueKey } from "@/src/lib/utils";
import { checkIfTwoShiftsHasEightHoursOfRestBetweenThem, checkIfhasShiftInterpolation } from "@/src/validations";
import { registerOrUpdateWorkDayByAdmin } from "../register/workDay/action";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

type UpdateWorkDayCellProps = {
    user:User
    roster:Roster
    shiftName:string
    day:number
    shifts:Shift[]
}


export function UpdateWorkDayCell({day,roster,shiftName,user,shifts}:UpdateWorkDayCellProps){
    const {toast} = useToast()
    const router = useRouter()

    const onlyShifts = shifts.filter(shift => shift.isAbscence === false && shift.isAvailable === true)
    const combinations = onlyShifts.map(shift =>{ 
        const shiftThatIsPossibleToCombinate = onlyShifts.find(shift2 => checkIfTwoShiftsHasEightHoursOfRestBetweenThem(shift,shift2))
        if(shiftThatIsPossibleToCombinate){
            return [shift.name,shiftThatIsPossibleToCombinate.name].join(" | ")
        }
        return "-"
    }).filter(shift=>shift!=="-")
    const abcenseShifts = shifts.filter(shift => shift.isAbscence === true && shift.isAvailable === true)
    const abcenseCombinations = abcenseShifts.map(shift =>{ 
        const shiftThatIsPossibleToCombinate = abcenseShifts.find(shift2 => checkIfhasShiftInterpolation(shift,shift2))
        if(shiftThatIsPossibleToCombinate){
            return [shift.name,shiftThatIsPossibleToCombinate.name].join(" | ")
        }
        return "-"
    }).filter(shift=>shift!=="-")

    const options = [...onlyShifts.map(shift=>shift.name),...combinations,...abcenseShifts.map(abscenses=>abscenses.name) ,...abcenseCombinations]

    const defaultValue = options.find(shift=>{
        const hasVerticalBarOnShiftName = shiftName.includes("|")
        const hasVerticalBarOnOption = shift.includes("|")
        if(hasVerticalBarOnOption && hasVerticalBarOnShiftName){
            const [shift1,shift2] = shift.split("|")
            const [shiftName1,shiftName2] = shiftName.split("|")
            if(shift1 === shiftName1 && shift2 === shiftName2){
                return true
            }
        }
        if(shift === shiftName){
            return true
        }
    
    }) ?? "-"
    

    async function handleUpdateWorkDay(shiftValue:string){
    
        const result = await registerOrUpdateWorkDayByAdmin(shiftValue,day,roster,user as User)
        if(("code" in result) && result.code !== 200){
            toast({
                title:"Erro",
                description:result.message,
            })
        }
        if(("code" in result) && result.code === 200){
            toast({
                title:"Sucesso",
                description:"Turno salvo com sucesso.",
               
            })
        }

        
    }


    return (
        <TableCell >
        <Select
        onValueChange={handleUpdateWorkDay}
        defaultValue={defaultValue}
        value={defaultValue}
      >
        <SelectTrigger className="w-24">
          <SelectValue id={`${user.id}-${day}`}   placeholder="Selecione um turno..." />
        </SelectTrigger>
        <SelectContent>

          <SelectItem value={"-"}>{"-"}</SelectItem>
        {
          options.map((shiftNameFromOptions) => (
            <SelectItem
              key={generateUniqueKey()}
              value={shiftNameFromOptions}
            >
              {shiftNameFromOptions}
            </SelectItem>
          ))
         }
        </SelectContent>
      </Select></TableCell>
    )
}