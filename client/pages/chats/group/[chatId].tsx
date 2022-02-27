import type { NextPage } from "next";
import { Box, Flex } from "@chakra-ui/react";

import { ChatInfo, GroupMenu, Message, MessageInput } from "@/features/chat";
import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import useScrollToBottom from "@/features/chat/hooks/useScrollToBottom";
import { sampleChat } from "@/sampleData";

const GroupChatPage: NextPage = () => {
  const messagesEndRef = useScrollToBottom<HTMLDivElement>();

  const leaveGroupHandler = () => {
    console.log("Leaving...");
  };

  const sendMessageHandler = (msg: string) => {
    console.log(msg);
  };

  const messages = sampleChat.messages.map((msg) => (
    <Message key={msg.id} sender={msg.sender} text={msg.text} />
  ));

  return (
    <AppLayout>
      <BackNav>
        <ChatInfo name="A Group" isGroup />
        <GroupMenu chatId="someid" onLeaveGroup={leaveGroupHandler} />
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

export default GroupChatPage;
