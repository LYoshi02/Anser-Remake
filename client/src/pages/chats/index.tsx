import type { NextPage } from "next";
import Image from "next/image";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

import { AppLayout } from "@/components/Layout";
import { welcomeImg } from "@/features/chat";
import { useAuthUser } from "@/hooks/useAuthUser";

const ChatsPage: NextPage = () => {
  const {} = useAuthUser({ redirectTo: "/login" });
  const backgroundColor = useColorModeValue("gray.50", "");

  return (
    <AppLayout keepChatsVisible>
      <Flex
        flexDirection="column"
        justify="center"
        align="center"
        height="full"
        textAlign="center"
        bgColor={backgroundColor}
      >
        <Box width="60" height="60" mb="4">
          <Image src={welcomeImg} alt="Welcome to Anser!" />
        </Box>
        <Text fontSize="4xl">
          Welcome to{" "}
          <Text as="span" style={{ fontWeight: "bold" }}>
            Anser
          </Text>
        </Text>
        <Text fontSize="lg">
          You can see your chats and talk with other users in the left menu
        </Text>
      </Flex>
    </AppLayout>
  );
};

export default ChatsPage;
