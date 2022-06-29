import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Flex } from "@chakra-ui/react";

import { ChatInfo, GroupMenu, Message, MessageInput } from "@/features/chat";
import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import useScrollToBottom from "@/features/chat/hooks/useScrollToBottom";
import {
  useAddMessageMutation,
  useGetGroupChatLazyQuery,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";

const GroupChatPage: NextPage = () => {
  const messagesEndRef = useScrollToBottom<HTMLDivElement>();
  const router = useRouter();
  const authUser = useAuthUser({ redirectTo: "/login" });
  const [getGroupChat, { data: chatData, loading }] =
    useGetGroupChatLazyQuery();
  const [addMessage] = useAddMessageMutation();

  const chatId = router.query.chatId as string;

  useEffect(() => {
    if (chatId) {
      const getChatData = async () => {
        try {
          await getGroupChat({
            variables: { chatId },
          });
        } catch (error) {
          console.log(error);
        }
      };

      getChatData();
    }
  }, [chatId, getGroupChat]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!chatData) {
    return <p>Chat not found</p>;
  }

  const leaveGroupHandler = () => {
    console.log("Leaving...");
  };

  const sendMessageHandler = async (text: string) => {
    const { _id: chatId, users: chatUsers } = chatData.getGroupChat;

    try {
      if (!chatId || !chatUsers) {
        throw new Error("Cannot send the message");
      }

      const chatUsersIds = chatUsers.map((u) => u._id);

      await addMessage({
        variables: {
          chatData: {
            recipients: chatUsersIds,
            text,
            chatId,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getSenderData = (senderId: string) => {
    return chatData.getGroupChat.users.find((u) => u._id === senderId);
  };

  let messages;
  if (chatData && authUser) {
    messages = chatData.getGroupChat.messages.map((msg) => {
      const senderData = getSenderData(msg.sender._id);
      const isSentByMe = msg.sender._id === authUser._id;

      return (
        <Message
          key={msg._id}
          sender={senderData!}
          text={msg.text}
          sentByMe={isSentByMe}
        />
      );
    });
  }

  return (
    <AppLayout>
      <BackNav>
        <ChatInfo
          name={chatData.getGroupChat.group?.name || ""}
          imageUrl={chatData.getGroupChat.group?.image?.url}
          isGroup
        />
        <GroupMenu chatId={chatId} onLeaveGroup={leaveGroupHandler} />
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
