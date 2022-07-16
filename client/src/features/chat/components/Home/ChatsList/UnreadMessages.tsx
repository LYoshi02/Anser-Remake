import { Flex, useColorModeValue } from "@chakra-ui/react";

type Props = {
  count: number;
};

export const UnreadMessages = (props: Props) => {
  const textColor = useColorModeValue("white", "gray.100");

  return (
    <Flex
      w="5"
      h="5"
      alignItems="center"
      justifyContent="center"
      bgColor="purple.600"
      rounded="full"
      lineHeight="1"
      fontWeight="bold"
      color={textColor}
    >
      {props.count}
    </Flex>
  );
};
