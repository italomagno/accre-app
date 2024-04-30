import { Military, Shifts } from "@/types";
import { breadCumbItens, chunkArray, getDaysInMonthWithWeekends } from "@/utils";
import {
  ChakraProvider,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
  Button,
  Text,
  HStack,
  VStack,
  Box,
  Flex
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ShiftPopOver } from "./shifts/ShftPopOver";
import { ShiftBox } from "./shifts/ShiftBox";
import Link from "next/link";
import { Footer } from "./Footer";
type CalendarComponentProps = {
  mil:Military
  necessaryShiftsPerDayPlusCombinations:Shifts[]
  Abscences: Shifts[]
  handleSelectedShift:(selectedShiftIndex:number,shiftString:string)=>void
  handleSaveShifts:()=>void
  isSaving: boolean
  shifts:Shifts[][]
  necessaryShiftsPerDay:Shifts[]
  month:number
  year:number


}

export function CalendarComponent({mil,necessaryShiftsPerDayPlusCombinations,handleSelectedShift,Abscences,handleSaveShifts,isSaving,shifts,necessaryShiftsPerDay,year,month}:CalendarComponentProps){

  const [days,setDays]=useState<Shifts[][]>([])

  useEffect(()=>{
    const daysOfTheMonth = getDaysInMonthWithWeekends(month,year).map(day => {
      const dateObject = new Date(year, month - 1, day.day)
      const newShift:Shifts = {
        shiftId: String(day.day),
        shiftName: dateObject.toLocaleDateString('pt-BR', {weekday:"short"}),
        quantityOfMilitary: day.isWeekend === true? 1 : 0,
      }
      return newShift
    })
    const daysChunked = chunkArray(daysOfTheMonth,7)
    setDays(daysChunked)
  },[])
  return (
    <Flex
    flexDir={"column"}
    alignItems={"center"}
    justify={"center"}
    my={"auto"}
    h={"100vh"}
    gap={5}
    >
      <HStack justify="space-between">
            <Box border={"1px"} bg={'yellow.300'} px={2} py={1} w={'48'} mr={"auto"} >
              <Text textAlign={"center"}>
                Militar
              </Text>
            </Box>
              <Box border={"1px"} bg={'whiteAlpha.300'} px={2} py={1} w={"100%"}>
                <Text textAlign={"center"}>
                  {mil.milName}
                </Text>
              </Box>
      </HStack>
      <Table
      mx={"auto"}
      variant='striped'
      >
        <Thead >
          <Tr>  
            { days.length >0 && days[0].map(dayOfWeek=>(
              <Th key={dayOfWeek.shiftName}>{dayOfWeek.shiftName}</Th>
            ))}
          </Tr>
        </Thead>

        <Tbody >
          {days.length >0 && days.map((day,i) => (
            <Tr key={i+"i"}>
              {day.map((day) => (
                <Td key={day.shiftId} >
                    
                  <ShiftPopOver
                    key={i+"j"}
                    shifts={shifts[Number(day.shiftId)-1]}
                    necessaryShiftsPerDay={necessaryShiftsPerDay}
                    handleSelectedShift={(shiftString) => {
                      handleSelectedShift(Number(day.shiftId)-1, shiftString);
                    }}
                     necessaryShiftsPerDayPlusCombinations={necessaryShiftsPerDayPlusCombinations}
                     Abscences={Abscences}
                     >
                  <VStack gap={2}>
                      <Box mr={4} color={day.quantityOfMilitary === 1 ? "red.500" : "inherit"}>
                      {day.shiftId}
                    </Box>
                  <ShiftBox
                  //@ts-ignore
                   shiftMil={mil.shiftsMil[Number(day.shiftId)-1].shift?  mil.shiftsMil[Number(day.shiftId)-1].shift :  "  -  "}
                   />
                  </VStack>

                  </ShiftPopOver>

                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex
        w={"full"}
        mt={6}
        pos={"relative"} 
        py={5}
        >
          <Flex w={"50%"}
          justifyContent={"center"}
          >
          <Button
           isLoading={isSaving}
           loadingText='Salvando...'
          colorScheme={"blue"} onClick={handleSaveShifts}>Salvar Proposição</Button>
          </Flex>
          <Flex w={"50%"}
          
          justifyContent={"center"}
          >
          <Button as={Link} href="/" colorScheme={"blue"}>Retornar Sem Salvar</Button>
          </Flex>
        </Flex>
        <Footer 
        breadCumbs={breadCumbItens}
       />
    </Flex>
  );
}