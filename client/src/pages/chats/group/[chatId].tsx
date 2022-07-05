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
  useLeaveGroupMutation,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";

const GroupChatPage: NextPage = () => {
  const messagesEndRef = useScrollToBottom<HTMLDivElement>();
  const router = useRouter();
  const authUser = useAuthUser({ redirectTo: "/login" });
  const [getGroupChat, { data: chatData, loading }] =
    useGetGroupChatLazyQuery();
  const [addMessage] = useAddMessageMutation();
  const [leaveGroup] = useLeaveGroupMutation();

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

  // ! BUG: these returns don't let the AppLayout loading and overwrite the chat cache
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!chatData) {
    return <p>Chat not found</p>;
  }

  console.log(chatData);

  const leaveGroupHandler = async () => {
    try {
      await leaveGroup({
        variables: {
          chatId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessageHandler = async (text: string) => {
    try {
      if (!chatId) {
        throw new Error("Cannot send the message");
      }

      await addMessage({
        variables: {
          chatData: {
            text,
            chatId,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  let messages, isMember;
  if (chatData && authUser) {
    isMember = chatData.getGroupChat.users.some((u) => u._id === authUser._id);
    messages = chatData.getGroupChat.messages.map((msg) => {
      const isSentByMe = Boolean(msg.sender && msg.sender._id === authUser._id);

      return (
        <Message
          key={msg._id}
          sender={msg.sender}
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
        {isMember && (
          <GroupMenu chatId={chatId} onLeaveGroup={leaveGroupHandler} />
        )}
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
        {isMember != null && (
          <MessageInput
            isMember={isMember}
            onSendMessage={sendMessageHandler}
          />
        )}
      </Flex>
    </AppLayout>
  );
};

export default GroupChatPage;
