import { useEffect } from "react";
import type { NextPage } from "next";
import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { ChatInfo, Message, MessageInput } from "@/features/chat";
import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import useScrollToBottom from "@/features/chat/hooks/useScrollToBottom";
import {
  useGetChatLazyQuery,
  useAddMessageMutation,
  useGetUserLazyQuery,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";

const UserChatPage: NextPage = () => {
  const router = useRouter();
  const [getChat, { data: chatData }] = useGetChatLazyQuery();
  const [addMessage] = useAddMessageMutation();
  const authUser = useAuthUser({ redirectTo: "/login" });

  const messagesEndRef = useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    if (router.query.user) {
      const getChatData = async () => {
        await getChat({
          variables: { recipientUsername: router.query.user as string },
        });
      };

      getChatData();
    }
  }, [router.query, getChat]);

  console.log(chatData);

  const sendMessageHandler = async (msg: string) => {
    try {
      if (!chatData) {
        throw new Error("No chat found");
      }

      const recipientsId = chatData.getChat.users.map((u) => u._id);

      await addMessage({
        variables: {
          chatData: {
            recipients: recipientsId,
            text: msg,
            chatId: chatData.getChat._id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  let messages;
  if (chatData && authUser) {
    messages = chatData.getChat.messages.map((msg) => {
      const senderData = chatData.getChat.users.find(
        (u) => u._id === msg.sender._id
      );

      return (
        <Message
          key={msg._id}
          sender={senderData!}
          text={msg.text}
          userId={authUser._id}
        />
      );
    });
  }

  return (
    <AppLayout>
      <BackNav>
        <ChatInfo name="Other User" />
      </BackNav>
      <Flex
        direction="column"
        justify="space-between"
        grow="1"
        overflow="hidden"
      >
        <Box overflow="auto" p="2">
          {messages}
          <div ref={messagesEndRef} />
        </Box>
        <MessageInput onSendMessage={sendMessageHandler} />
      </Flex>
    </AppLayout>
  );
};

export default UserChatPage;
