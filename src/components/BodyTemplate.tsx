import { LegacyRef, ReactNode } from "react"
import { Box, Flex ,Spinner} from '@chakra-ui/react'
import { breadCumbItens } from '@/utils'
import { v4  as uuid } from 'uuid'
import { ShiftsComponent } from "./shifts/ShiftsComponent"
import { Footer } from "./Footer"
import { Shifts } from "@/types"

interface BodyTemplateProps{
  children: ReactNode
  handleScroll:()=>void
  flexRef:LegacyRef<HTMLDivElement>
  necessaryShiftsPerDay: Shifts[]
  shifts: Shifts[][]
}


export const BodyTemplate =({children,flexRef,handleScroll,necessaryShiftsPerDay,shifts}:BodyTemplateProps)=>{


  return(
    <>
    {  
      shifts.length > 0? 
        <Flex flexDir="column" justifyContent={{lg:"space-between"}} bg="gray.100" h={"100vh"} key={uuid()} >
        <Box>
        
        <ShiftsComponent
        handleReference={handleScroll}
        necessaryShiftsPerDay={necessaryShiftsPerDay}
        reference={flexRef}
        shifts={shifts}
        />
        {
          children
        }

        </Box>
        <Box>
        <Footer 
        breadCumbs={breadCumbItens}
       />
        </Box>
     
     
      </Flex>
      :
      <>
          <Flex justifyContent={"center"} alignItems={"center"}  h={"100%"}>
          <Spinner size='lg' w={100} h={100} />
          </Flex>
          <Footer 
        breadCumbs={breadCumbItens}
       />
          </>
      }
      
      
      </>
  )
}