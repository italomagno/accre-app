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
  Text,
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
        <ModalContent>
          <ModalHeader>Escolha um Turno ou Afastamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir={"column"}>
              <Button colorScheme={selectedShiftType === "shift" ? "blue" : "gray"}
                onClick={() => handleShiftTypeSelection("shift")}>Turno</Button>
              <Button colorScheme={selectedShiftType === "absence" ? "blue" : "gray"}
                onClick={() => handleShiftTypeSelection("absence")}>Afastamento</Button>

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
          <ModalFooter>
          <Button colorScheme="red" onClick={()=>{
            handleShiftSelection(" - ")
            onClose()
            }}>
              Excluir
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
