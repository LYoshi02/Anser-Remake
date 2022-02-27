import type { NextPage } from "next";
import Image from "next/image";
import { DiGithubBadge } from "react-icons/di";
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { Link } from "@/components/UI";
import { logoImg } from "@/features/auth";

const HomePage: NextPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex w="100%" minH="100vh" bg={bgColor} direction="column">
      <Flex p="2" justify="flex-end" align="center">
        <Link
          href="https://github.com/LYoshi02/Anser"
          linkProps={{ isExternal: true }}
        >
          <Icon as={DiGithubBadge} h="12" w="12" />
        </Link>
      </Flex>
      <Stack
        spacing="6"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow="1"
      >
        <Box height="80" width="80">
          <Image src={logoImg} alt="Anser Logo" priority />
        </Box>
        <Stack
          spacing="2"
          w={{ base: "90%", md: "80%", lg: "70%" }}
          textAlign="center"
        >
          <Link href="/login">
            <Button
              w={{ base: "100%", sm: "72" }}
              variant="solid"
              colorScheme="yellow"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              w={{ base: "100%", sm: "72" }}
              variant="outline"
              colorScheme="yellow"
            >
              Sign Up
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default HomePage;
