import { ReactNode } from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";

import Home from "../../features/chat/components/Home/Home";

type Props = {
  children: ReactNode;
  keepChatsVisible?: boolean;
};

const AppLayout = ({ children, keepChatsVisible }: Props) => {
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      height="100%"
      maxH="100%"
      bgColor="purple.900"
      py={{ base: "0", "2xl": "8" }}
    >
      <Flex
        height="100%"
        maxH="100%"
        maxW={{ base: "100%", "2xl": "1400px" }}
        overflow="hidden"
        bgColor={bgColor}
        borderRadius="sm"
        margin="0 auto"
        shadow="lg"
      >
        <Box
          borderRight={{ base: "none", lg: "1px solid" }}
          borderColor={{ base: "none", lg: borderColor }}
          overflow="auto"
          minWidth={{ base: "100%", lg: "25rem", xl: "30rem" }}
          d={keepChatsVisible ? "block" : { base: "none", lg: "block" }}
        >
          <Home />
        </Box>

        <Flex
          flexGrow="1"
          overflow="auto"
          d={keepChatsVisible ? { base: "none", lg: "flex" } : "flex"}
          h="full"
          maxH="full"
          direction="column"
        >
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};

export default AppLayout;
