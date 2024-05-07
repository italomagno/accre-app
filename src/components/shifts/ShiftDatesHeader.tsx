import { generateRandomKey, getDaysInMonthWithWeekends } from "@/utils"
import { ShiftBox } from "./ShiftBox"
import { Flex } from "@chakra-ui/react"

interface ShiftDatesHeaderProps{
  month:number
  year:number
}


export function ShiftDatesHeader({month,year}:ShiftDatesHeaderProps){
  return(
    <Flex 
        >
         {
          getDaysInMonthWithWeekends(month,year).map((day,i) =>{
             
          return(
            <ShiftBox
            key={generateRandomKey(i,8)+"hope"}
            bgColor={day.isWeekend? "purple" : "yellow.300"}
            shiftMil={String(day.day)}
            />
          )
         })
        }
        </Flex>
  )
}