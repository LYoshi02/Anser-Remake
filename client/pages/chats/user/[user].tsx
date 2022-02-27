import type { NextPage } from "next";
import { Box, Flex } from "@chakra-ui/react";

import { ChatInfo, Message, MessageInput } from "@/features/chat";
import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import { sampleChat } from "@/sampleData";
import useScrollToBottom from "@/features/chat/hooks/useScrollToBottom";

const UserChatPage: NextPage = () => {
  const messagesEndRef = useScrollToBottom<HTMLDivElement>();

  const sendMessageHandler = (msg: string) => {
    console.log(msg);
  };

  const messages = sampleChat.messages.map((msg) => (
    <Message key={msg.id} sender={msg.sender} text={msg.text} />
  ));

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
