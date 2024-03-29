import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { DiGithubBadge } from "react-icons/di";
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import { Link } from "@/components/UI";
import { logoImg } from "@/features/auth";
import { useAuthUser } from "@/hooks/useAuthUser";

const HomePage: NextPage = () => {
  const {} = useAuthUser({ redirectTo: "/chats", redirectIfFound: true });
  const router = useRouter();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <>
      <NextSeo title="Home" />
      <Flex w="100%" minH="100vh" bg={bgColor} direction="column">
        <Flex p="2" justify="flex-end" align="center">
          <Link
            href="https://github.com/LYoshi02/Anser-Remake"
            linkProps={{
              isExternal: true,
              "aria-label": "Project's GitHub repository",
            }}
          >
            <Icon as={DiGithubBadge} h="12" w="12" />
          </Link>
        </Flex>
        <Stack
          spacing="6"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
        >
          <Box
            height={{ base: "60", sm: "80" }}
            width={{ base: "60", sm: "80" }}
          >
            <Image
              src={logoImg}
              alt="Anser Logo"
              priority
              layout="responsive"
            />
          </Box>
          <Stack
            spacing="2"
            w={{ base: "90%", md: "80%", lg: "70%" }}
            textAlign="center"
            alignItems="center"
          >
            <Button
              w={{ base: "100%", sm: "72" }}
              variant="solid"
              colorScheme="yellow"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              w={{ base: "100%", sm: "72" }}
              variant="outline"
              colorScheme="yellow"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
};

export default HomePage;
