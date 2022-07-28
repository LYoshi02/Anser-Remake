import { Flex, Spinner as ChakraSpinner, Text } from "@chakra-ui/react";

type Props = {
  text?: string;
};

const Spinner = ({ text }: Props) => {
  return (
    <Flex p="2" gap="4" justifyContent="center">
      <ChakraSpinner color="purple.500" />
      <Text>{text || "Loading..."}</Text>
    </Flex>
  );
};

export default Spinner;
