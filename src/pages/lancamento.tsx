import { BodyTemplate } from "@/components/BodyTemplate";
import { useEffect, useRef, useState } from "react";
import { militaries, necessaryShiftsPerDay } from ".";
import { getDaysInMonthWithWeekends, handleQntPerShift } from "@/utils";
import { Military, Shifts, ShiftsMil } from "@/types";
import { SectionContainer } from "@/components/SectionContainer";
import { Box, HStack, Text, Flex, Button } from "@chakra-ui/react";
import { ShiftBox } from "@/components/shifts/ShiftBox";
import { ShiftDatesHeader } from "@/components/shifts/ShiftDatesHeader";
import { ShiftPopOver } from "@/components/shifts/ShftPopOver";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";



export default function Lancamento() {

  const [shifts, setShifts] = useState<Shifts[][]>([])
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean[]>(shifts.map(shift=>false));


  const [mil, setMil] = useState<Military>({
    milId: 1,
    milName: "Militar não encontrado",
    shiftsMil:  getDaysInMonthWithWeekends(2,2023).map(day=>{
      const shifts:ShiftsMil = {
        day: String(day.day),
        shift:undefined
      }

        return shifts
      })
  })

  const flexRef2 = useRef<HTMLDivElement>(null); // Referência para o segundo Flex
  const flexRef1 = useRef<HTMLDivElement>(null); // Referência para o segundo Flex

  const handleScrollFlex2 = () => {

    if (flexRef1.current && flexRef2.current) {
      flexRef1.current.scrollLeft = flexRef2.current.scrollLeft;
    }
  };
  const handleScrollFlex1 = () => {

    if (flexRef1.current && flexRef2.current) {
      flexRef2.current.scrollLeft = flexRef1.current.scrollLeft;
    }
  };


  function handleSelectedMil(milId: number) {
    const selectedMil = militaries.find(mil => mil.milId === milId)
    if (!selectedMil) return
    setMil(selectedMil)
  }

  function handleSelectedShift(selectedShiftIndex:number,shiftString:string){

    const newMil = {
      ...mil,
      shiftsMil:mil.shiftsMil.map((shift,index)=>{
        if(index === selectedShiftIndex) return {day: shift.day,
         shift:shiftString}
        return shift
      })

    }  

    setMil(newMil)
    const QntMilitariesPerDay = handleQntPerShift(militaries, necessaryShiftsPerDay)
    setShifts(QntMilitariesPerDay)

  }
  function handleOpenPopOver(index:number){
    const newPopover = isPopoverOpen.map((boolean,i)=>{
      if(index === i) return true
      return false
    })

    setIsPopoverOpen(newPopover)
  }
  function handleClosePopOver(index:number){
    const newPopover = isPopoverOpen.map((boolean,i)=>{
      if(index ===i) return false
      return false
    })

    setIsPopoverOpen(newPopover)
  }

  useEffect(() => {
    const QntMilitariesPerDay = handleQntPerShift(militaries, necessaryShiftsPerDay)
   
    setShifts(QntMilitariesPerDay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mil])


  return (
    <BodyTemplate
      flexRef={flexRef2}
      handleScroll={handleScrollFlex2}
      necessaryShiftsPerDay={necessaryShiftsPerDay}
      shifts={shifts}
    >

      <SectionContainer
        sectionId={"SelectedMil"}
        height={200}
      >
        <HStack
          spacing={4}
        >
          <Box>
            <Box border={"1px"} bg={'yellow.300'} px={2} py={1} w={'48'} >
              <Text textAlign={"center"}>
                Militar
              </Text>
            </Box>
            <Flex key={mil.milId} w={'48'} >
              <Box border={"1px"} bg={'whiteAlpha.300'} px={2} py={1} w={"100%"}>
                <Text textAlign={"center"}>
                  {mil.milName}
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box
          overflowX={"auto"}
          ref={flexRef1}
          onScroll={handleScrollFlex1}
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

          >
          <Box >
          <ShiftDatesHeader 
          month={2}
          year={2023}
          />
        </Box>
          <>
          
        </>
        {

          
              <Flex key={mil.milId } 
              width={"fit-content"}
              >
                {mil.shiftsMil.map((shift,j)=>{
                return(
                  <ShiftPopOver
                   key={j}
                   handleSelectedShift={(shiftString)=>{
                    handleSelectedShift(j,shiftString)
                  }}
                  >
                  <ShiftBox
                   shiftMil={shift.shift?  shift.shift :  "  -  "}
                   />
                  </ShiftPopOver>

                )
                })}
              </Flex>
           
        }

          </Box>


        </HStack>
        <Flex
        w={"full"}
        mt={6}
        pos={"relative"}
        >
          <Flex w={"50%"}
          justifyContent={"center"}
          >
          <Button colorScheme={"blue"}>Salvar Proposição</Button>
          </Flex>
          <Flex w={"50%"}
          
          justifyContent={"center"}
          >
          <Button as={Link} href="/" colorScheme={"blue"}>Retornar Sem Salvar</Button>
          </Flex>

        </Flex>

      </SectionContainer>



    </BodyTemplate>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};