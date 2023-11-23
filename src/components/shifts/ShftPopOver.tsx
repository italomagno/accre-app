import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Heading,
  Box,
  HStack,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { necessaryShiftsPerDayPlusCombinations } from "@/pages";
import { chunkArray } from "@/utils";

interface ShiftPopOverProps {
  children: ReactNode;
  handleSelectedShift: (shiftString: string) => void;
}

export function ShiftPopOver({ children, handleSelectedShift }: ShiftPopOverProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedShiftType, setSelectedShiftType] = useState<string | undefined>(undefined);
  const groupedShifts = chunkArray(necessaryShiftsPerDayPlusCombinations, 3);

  function handleShiftTypeSelection(type: string) {
    setSelectedShiftType(type);
  }

  function handleShiftSelection(shiftString: string) {
    handleSelectedShift(shiftString);
    onClose(); // Fechar o modal após a seleção
  }

  return (
    <>
      <Button onClick={onOpen} padding={0} h={"fit-content"}>
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg='blackAlpha.600' />
        <ModalContent
        w={"50vw"}
        my={"auto"}
        mx={"auto"}
        bg={"white"}

        >
          <ModalHeader
          
          py={3}
          px={4}
          mb={3}
          >
            <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            >
              <Box><Heading
              fontWeight={"extrabold"}
              >
              Escolha um: 
              </Heading></Box>
              <Box> <ModalCloseButton /></Box>
            </Flex>
            
            </ModalHeader>
          <ModalBody
          py={3}
          px={4}
          >
            <Flex flexDir={"column"}>


              <Flex
              w={"full"}
              justifyContent={"space-around"}
              mb={3}
              >
                <Button w="35%"colorScheme={selectedShiftType === "shift" ? "blue" : "gray"}
                onClick={() => handleShiftTypeSelection("shift")}>Turno</Button>
              <Button w="35%" colorScheme={selectedShiftType === "absence" ? "blue" : "gray"}
                onClick={() => handleShiftTypeSelection("absence")}>Afastamento</Button>

              </Flex>

              {selectedShiftType === "shift" && (
                <VStack spacing={2} mt={3}>
                  {groupedShifts.map((group, index) => (
                    <HStack key={index} spacing={2}>
                      {group.map((shift) => (
                        <Button key={shift.shiftId} height='20px' width="20px"
                          onClick={() => handleShiftSelection(shift.shiftName)}>
                          {shift.shiftName}
                        </Button>
                      ))}
                    </HStack>
                  ))}
                </VStack>
              )}
              {/* Implemente aqui a lógica para escolha de Afastamento */}
            </Flex>
          </ModalBody>
          <ModalFooter
          py={3}
          px={4}
          >
          <Button colorScheme="red" onClick={()=>{
            handleShiftSelection(" - ")
            onClose()
            }}>
              Excluir
            </Button>
            <Button
            ml={3}
            colorScheme="blue" onClick={onClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
