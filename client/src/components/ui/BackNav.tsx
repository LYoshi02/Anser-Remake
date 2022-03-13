import { ReactNode } from "react";
import { useRouter } from "next/router";
import { Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import { HiChevronLeft } from "react-icons/hi";

type Props = {
  children?: ReactNode;
  isBackIconRequired?: boolean;
};

const BackNav = (props: Props) => {
  const router = useRouter();
  const colorMainNavbar = useColorModeValue("purple.700", "gray.900");

  let displayIconValue: string | object = "";
  if (!props.isBackIconRequired) {
    displayIconValue = { base: "block", lg: "none" };
  }

  return (
    <Flex h="14" minH="14" bg={colorMainNavbar} align="center">
      <Icon
        as={HiChevronLeft}
        w="10"
        h="10"
        color="gray.200"
        onClick={() => router.back()}
        cursor="pointer"
        display={displayIconValue}
      />
      {props.children}
    </Flex>
  );
};

export default BackNav;
