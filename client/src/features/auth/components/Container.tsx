import { ReactNode } from "react";
import {
  Flex,
  Container as ChakraContainer,
  useColorModeValue,
} from "@chakra-ui/react";

import Navigation from "./Navigation";

type Props = {
  children: ReactNode;
};

const AuthContainer = (props: Props) => {
  const flexBgColor = useColorModeValue("gray.100", "");
  const containerBgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex minH="100vh" direction="column">
      <Navigation />
      <Flex grow={1} py="4" px="2" bg={flexBgColor}>
        <ChakraContainer
          py="12"
          px="6"
          bg={containerBgColor}
          boxShadow="lg"
          rounded="md"
          alignSelf="center"
        >
          {props.children}
        </ChakraContainer>
      </Flex>
    </Flex>
  );
};

export default AuthContainer;
