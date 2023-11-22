import { Flex, Box, Text, BoxProps } from "@chakra-ui/react";
import React, { LegacyRef } from "react";

interface ShiftBoxProps extends BoxProps {
  shiftMil: string;
}

export const ShiftBox = React.forwardRef<HTMLDivElement | HTMLButtonElement, ShiftBoxProps>(
  ({ shiftMil, ...props }, ref) => {
    return (
      <Flex w={12}>
        <Box
          border={"1px"}
          px={2}
          py={1}
          w={"full"}
          {...props}
          ref={ref}
        >
          <Text w={14} m={0} whiteSpace={"nowrap"} textAlign={"left"}>
            {shiftMil}
          </Text>
        </Box>
      </Flex>
    );
  }
);

ShiftBox.displayName = "ShiftBox";
