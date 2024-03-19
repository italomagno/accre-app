import { BodyTemplate } from "@/components/BodyTemplate";
import { useEffect, useRef, useState } from "react";
import { getDaysInMonthWithWeekends, handleQntPerShift } from "@/utils";
import { DataFromSheet, Military, Shifts, ShiftsMil } from "@/types";
import { SectionContainer } from "@/components/SectionContainer";
import { Box, HStack, Text, Flex, Button, useToast } from "@chakra-ui/react";
import { createStandaloneToast } from '@chakra-ui/react'
import { ShiftBox } from "@/components/shifts/ShiftBox";
import { ShiftDatesHeader } from "@/components/shifts/ShiftDatesHeader";
import { ShiftPopOver } from "@/components/shifts/ShftPopOver";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { decrypt } from "@/utils/crypto";
import { error } from "console";


interface SetShiftProps{
  user: Military;  // Substitua SessionType pelo tipo correto de sua sessão
  militaries: Military[];
  necessaryShiftsPerDay: Shifts[]
  necessaryShiftsPerDayPlusCombinations:Shifts[]
  month:number
  year:number,
  block_changes:boolean
}

export default function Lancamento({militaries,necessaryShiftsPerDay,necessaryShiftsPerDayPlusCombinations,month,year,user,block_changes}:SetShiftProps) {
  const { toast } = createStandaloneToast();

  const [shifts, setShifts] = useState<Shifts[][]>([])
  const [isSaving,setIsSaving] = useState<boolean>(false)

  const [mil, setMil] = useState<Military>(user)

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

  async function handleSaveShifts(){
    if(block_changes === true){
    setIsSaving(true)
    toast({
      title: 'Adição de turnos Travadas!',
      description: "Turnos travados pelos escalantes.",
      status: 'warning',
      duration: 9000,
      isClosable: true,
    })

      setTimeout(() => {
    setIsSaving(false)
      }, 2000);
    }else{

    setIsSaving(true)
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/googlesheets?saram=${mil.milId}`, {
        method: 'PUT',
        body: JSON.stringify(mil.shiftsMil),
      })
      
    if(res.status===200) {
       toast({
        title: 'Deu certo!',
        description: "Turnos salvos com Sucesso.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    setIsSaving(false)

    }else{
      setIsSaving(false)
     toast({
        title: 'Eita pau!',
        description: "Problema no salvamento dos turnos.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

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
    const QntMilitariesPerDay = handleQntPerShift(militaries, necessaryShiftsPerDay,month,year)
    setShifts(QntMilitariesPerDay)

  }

  useEffect(() => {
    const newMilitaries = militaries.map(military=>{
      if(military.milId === mil.milId) return mil
      return military
    })
    const QntMilitariesPerDay = handleQntPerShift(newMilitaries, necessaryShiftsPerDay,month,year)
    setShifts(QntMilitariesPerDay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mil])


  return (
    <BodyTemplate
    flexRef={flexRef2}
    handleScroll={handleScrollFlex2}
    necessaryShiftsPerDay={necessaryShiftsPerDay}
    shifts={shifts}
    year={year}
    month={month}
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
          month={month}
          year={year}
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
                    handleSelectedShift={(shiftString) => {
                      handleSelectedShift(j, shiftString);
                    } }
                     necessaryShiftsPerDayPlusCombinations={necessaryShiftsPerDayPlusCombinations}>
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

      </SectionContainer>



    </BodyTemplate>
  )
}


export const getServerSideProps: GetServerSideProps<SetShiftProps> = async (context) => {
  const session = await getSession({ req: context.req });



  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/googlesheets`, {
      method: 'GET',
    })
    const dataEncrypted = await res.json()
    const dataDecrypted = decrypt(dataEncrypted)
    const data:DataFromSheet = JSON.parse(dataDecrypted)

    const { militaries } = data["tabs"][0]
    const { month } = data["tabs"][0]
    const { year } = data["tabs"][0]




    const { controlers:shifts } = data["tabs"][0]
        //@ts-ignore
        const block_changes = shifts[0]["block_changes"] === 'TRUE'

    const necessaryShiftsPerDay: Shifts[] = shifts.map((shift: any) => {
      const newShift: Shifts = {
        shiftId: shift.shiftName,
        shiftName: shift.shiftName,
        quantityOfMilitary: Number(shift.quantityOfMilitary)
      }
      return newShift
    })
    const Combinations: Shifts[] = shifts.map((shift: any) => {
      const newShift: Shifts = {
        shiftId: shift.combinations,
        shiftName: shift.combinations,
        quantityOfMilitary: 0
      }
      return newShift
    })

    const user = militaries.find(mil=> mil.milName === String(session.user?.name))

    
    if(!user) throw error("Não foi possível encontrar esse militar.")
    if(user?.shiftsMil.length === 0) user.shiftsMil = getDaysInMonthWithWeekends(1,2024).map(day=>{
      const shifts:ShiftsMil = {
        day: String(day.day),
        shift:" - "
      }
        return shifts
      })


    const necessaryShiftsPerDayPlusCombinations = [
      ...necessaryShiftsPerDay,
      ...Combinations
    ].filter(shift => shift.shiftId !== undefined)



    return {
      props: {
        session,
        militaries,
        necessaryShiftsPerDay,
        necessaryShiftsPerDayPlusCombinations,
        month:Number(month),
        year:Number(year),
        user,
        block_changes
      },
    };


  } catch (error) {
    console.error(error);
    // Retorne um array vazio para militaries em caso de erro
    return {
      props: {
        session, militaries: []
        ,
        necessaryShiftsPerDay: [],
        necessaryShiftsPerDayPlusCombinations: [],
        month: 1,
        year: 2023,
        user:{
          milId: 0,
          milName: "Militar Não Cadastrado" ,
          shiftsMil:  getDaysInMonthWithWeekends(1,2024).map(day=>{
            const shifts:ShiftsMil = {
              day: String(day.day),
              shift:" - "
            }
              return shifts
            })
        },
        block_changes:true
      },
    };
  }

};