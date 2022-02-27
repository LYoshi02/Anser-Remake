import type { NextPage } from "next";
import { Avatar, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container, Link } from "@/components/UI";
import { mainSampleUser } from "@/sampleData";

const UserPage: NextPage = () => {
  return (
    <AppLayout>
      <BackNav />
      <Container>
        <Flex direction="column" align="center">
          <Avatar size="2xl" name={mainSampleUser.fullname}></Avatar>
          <Box w="full" textAlign="center">
            <Stack spacing="2">
              <Text fontSize="3xl" mt="2" fontWeight="bold">
                {mainSampleUser.fullname}
              </Text>
              {mainSampleUser.description && (
                <Text fontSize="lg">{mainSampleUser.description}</Text>
              )}
            </Stack>
            <Link href={`/chats/user/${mainSampleUser.username}`}>
              <Button colorScheme="purple" mt="4" isFullWidth>
                Enviar Mensaje
              </Button>
            </Link>
          </Box>
        </Flex>
      </Container>
    </AppLayout>
  );
};

export default UserPage;
