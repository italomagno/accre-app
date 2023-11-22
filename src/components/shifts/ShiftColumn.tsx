import { Shifts } from "@/types";
import { Flex,Box,Text } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';


interface ShiftColumnProps{
  columnHeader: string
  shiftsPerDayArray: Shifts[]
  necessaryShiftsPerDay: Shifts[]
  isWeekend: boolean
}

export function ShiftColumn({columnHeader,shiftsPerDayArray,necessaryShiftsPerDay,isWeekend}: ShiftColumnProps){

  function handleColor(necessaryQnt:number,qnt:number){
    const hasMoreThanNecessary = necessaryQnt - qnt < 0
    const hasLessThanNecessary = necessaryQnt - qnt > 0
    const hasNecessary = necessaryQnt - qnt === 0

    if(hasMoreThanNecessary) return "blue"
    if(hasLessThanNecessary) return "red"
    if(hasNecessary) return "green"
  }
  var i = 0


 return(
  <>
  {
    shiftsPerDayArray &&

  <Flex flexDir={"column"}>
  <Box  border={"1px"}  bg={isWeekend? "purple" : "yellow.300"} w={12}>
            <Text textAlign={"center"}>
            {columnHeader}
            </Text>
  </Box>
{
              shiftsPerDayArray.map((shift,i) =>{
                const necessaryQnt = necessaryShiftsPerDay[i].quantityOfMilitary
                const qnt = shift.quantityOfMilitary

                return(
                <Flex key={uuidv4() +  i} w={12} >
                  <Box border={"1px"} bg={handleColor(necessaryQnt,qnt)} borderColor={isWeekend? "purple" : "black"} px={2} py={1} w={"100%"}>
                    <Text textAlign={"center"}>
                  {shift.quantityOfMilitary}
                    </Text>
                  </Box>
                </Flex>
  )})
}
</Flex>
  }

</>

 )}