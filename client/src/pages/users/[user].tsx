import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Avatar, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container, Link } from "@/components/UI";
import { useGetFullUserQuery } from "@/graphql/generated";

const UserPage: NextPage = () => {
  const router = useRouter();
  const { loading, data: userData } = useGetFullUserQuery({
    variables: { username: router.query.user as string },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>User not found</p>;
  }

  console.log(userData);

  return (
    <AppLayout>
      <BackNav />
      <Container>
        <Flex direction="column" align="center">
          <Avatar
            size="2xl"
            name={userData.getUser.fullname}
            src={userData.getUser.profileImg?.url}
          ></Avatar>
          <Box w="full" textAlign="center">
            <Stack spacing="2">
              <Text fontSize="3xl" mt="2" fontWeight="bold">
                {userData.getUser.fullname}
              </Text>
              {userData.getUser.description && (
                <Text fontSize="lg">{userData.getUser.description}</Text>
              )}
            </Stack>
            <Link href={`/chats/user/${userData.getUser.username}`}>
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
