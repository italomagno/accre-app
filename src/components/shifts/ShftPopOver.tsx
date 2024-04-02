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
import { chunkArray } from "@/utils";
import { Shifts } from "@/types";

interface ShiftPopOverProps {
  children: ReactNode;
  handleSelectedShift: (shiftString: string) => void;
  necessaryShiftsPerDayPlusCombinations: Shifts[]
  Abscences: Shifts[]
}

export function ShiftPopOver({ children, handleSelectedShift, necessaryShiftsPerDayPlusCombinations, Abscences }: ShiftPopOverProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedShiftType, setSelectedShiftType] = useState<string | undefined>(undefined);
  const groupedShifts = chunkArray(necessaryShiftsPerDayPlusCombinations, 3);
  const groupedAbscences = chunkArray(Abscences, 3);

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
                <Button w="35%" colorScheme={selectedShiftType === "shift" ? "blue" : "gray"}
                  onClick={() => handleShiftTypeSelection("shift")}>Turno</Button>
                <Button w="35%" disabled={true} colorScheme={selectedShiftType === "absence" ? "blue" : "gray"}
                  onClick={() => handleShiftTypeSelection("absence")}>Afastamento</Button>

              </Flex>

              {
                selectedShiftType === "shift" && (
                  <VStack spacing={2} mt={3}>
                    {groupedShifts.map((group, index) => (
                      <HStack key={index} spacing={2}>
                        {group.map((shift) => (
                          <Button key={shift.shiftId} px={4}
                            onClick={() => handleShiftSelection(shift.shiftName)}>
                            {shift.shiftName}
                          </Button>
                        ))}
                      </HStack>
                    ))}
                  </VStack>
                )
              }

              {
                selectedShiftType === "absence" && (
                  <VStack spacing={2} mt={3}>
                    {groupedAbscences.map((group, index) => (
                      <HStack key={index} spacing={2}>
                        {group.map((shift) => (
                          <Button key={shift.shiftId}
                            onClick={() => handleShiftSelection(shift.shiftName)}>
                            {shift.shiftName}
                          </Button>
                        ))}
                      </HStack>
                    ))}
                  </VStack>
                )

              }
            </Flex>
          </ModalBody>
          <ModalFooter
            py={3}
            px={4}
          >
            <Button colorScheme="red" onClick={() => {
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
