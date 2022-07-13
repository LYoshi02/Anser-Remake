import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Avatar, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";

import { AppLayout } from "@/components/Layout";
import { Alert, BackNav, Container, Link, Spinner } from "@/components/UI";
import { useGetFullUserLazyQuery } from "@/graphql/generated";
import { useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";

const UserPage: NextPage = () => {
  const {} = useAuthUser({ redirectTo: "/login" });
  const router = useRouter();
  const [getUser, { loading: reqLoading, data: userData }] =
    useGetFullUserLazyQuery();

  const username = router.query.user as string;

  useEffect(() => {
    if (username) {
      const getUserData = async () => {
        try {
          await getUser({
            variables: { username },
          });
        } catch (e) {}
      };

      getUserData();
    }
  }, [getUser, username]);

  let content = <Spinner text="Loading user..." />;
  if (!userData && !reqLoading) {
    content = <Alert alertProps={{ status: "error" }} title="User not found" />;
  } else if (userData) {
    content = (
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
    );
  }

  return (
    <AppLayout>
      <BackNav />
      <Container>{content}</Container>
    </AppLayout>
  );
};

export default UserPage;
