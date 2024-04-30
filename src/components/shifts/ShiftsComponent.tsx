import { getDaysInMonthWithWeekends } from "@/utils"
import { HStack, Flex,Box,Text } from "@chakra-ui/react"
import { SectionContainer } from "../SectionContainer"
import { ShiftColumn } from "./ShiftColumn"
import { v4 as uuid } from "uuid"
import { Shifts } from "@/types"
import { LegacyRef } from "react"



interface ShiftsProps{
  necessaryShiftsPerDay: Shifts[]
  shifts: Shifts[][]
  reference: LegacyRef<HTMLDivElement>
  handleReference: ()=>void;
  year:number
  month:number
}

export function ShiftsComponent({necessaryShiftsPerDay,reference,handleReference,shifts,month,year}:ShiftsProps){


  return(
    <SectionContainer sectionId={"Shifts"} >
          <HStack spacing={4}>
          <Flex flexDir={"column"}>
                <Box  border={"1px"} bg={'yellow.300'} w={'48'}  >
                    <Text textAlign={"center"}>
                      Turnos
                    </Text>
                  </Box>  
            {
              necessaryShiftsPerDay.map((shift,k) =>{
                return(
                <Flex key={k+uuid()} w={'48'} >
                  <Box border={"1px"} bg={'blue.300'} px={2} py={1} w={"50%"}>
                    <Text textAlign={"center"}>
                  {shift.shiftName}
                    </Text>
                  </Box>
                  <Box  border={"1px"} bg={'whiteAlpha.300'} px={2} py={1} w={"50%"}>
                    <Text textAlign={"center"}>
                    {shift.quantityOfMilitary}
                    </Text>
                  </Box>
                 </Flex>
                )
              })
            }
          </Flex>
          <Flex overflowX={"scroll"}
          mt={2}
          ref={reference} 
          onScroll={handleReference}
          sx={{
            '&::-webkit-scrollbar': {
              //width: '16px', // Ajuste para o tamanho desejado
              height: '4px', // Para a barra de rolagem vertical
            },
            '&::-webkit-scrollbar-track': {
              background: 'gray.200', // Cor de fundo da trilha da barra de rolagem
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.500', // Cor da barra de rolagem
              borderRadius: '8px', // Raio da borda para a barra de rolagem
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'gray.600', // Cor da barra de rolagem ao passar o mouse
            },
          }}
         /*  onScroll={(v)=>{
            handleScroll(v.currentTarget.scrollLeft)
            v.currentTarget.scrollLeft = scrollPos
            return v
            }}
             */
            >
          {
            getDaysInMonthWithWeekends(month,year).map((day,i) =>{
           return ( 
           <ShiftColumn key={uuid() + i}
            columnHeader={String(day.day)}
            shiftsPerDayArray={shifts[i]}
            necessaryShiftsPerDay={necessaryShiftsPerDay}
            isWeekend={day.isWeekend}

             />
             )
             
             })
          }          
          </Flex>

          </HStack>
      </SectionContainer>
  )
}