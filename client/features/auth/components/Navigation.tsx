import { Flex } from "@chakra-ui/react";

import { BackNav } from "@/components/UI";
import ThemeIcon from "./ThemeIcon";

const AuthNavigation = () => {
  return (
    <BackNav isBackIconRequired>
      <Flex
        w="full"
        justify="flex-end"
        mr="2"
        cursor="pointer"
        color="gray.100"
      >
        <ThemeIcon />
      </Flex>
    </BackNav>
  );
};

export default AuthNavigation;
