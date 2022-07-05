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
  useCreateNewChatMutation,
  OnNewMessageAddedDocument,
  OnNewMessageAddedSubscription,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";

const UserChatPage: NextPage = () => {
  const router = useRouter();
  const [getChat, { data: chatData, subscribeToMore, refetch: refetchChat }] =
    useGetChatLazyQuery();
  const [getRecipient, { data: recipientData }] = useGetUserLazyQuery();
  const [createNewChat] = useCreateNewChatMutation();
  const [addMessage] = useAddMessageMutation();
  const authUser = useAuthUser({ redirectTo: "/login" });
  const messagesEndRef = useScrollToBottom<HTMLDivElement>();

  const recipientUsername = router.query.user as string;

  useEffect(() => {
    if (recipientUsername) {
      const getChatData = async () => {
        try {
          await getChat({
            variables: { recipientUsername },
          });

          await getRecipient({ variables: { username: recipientUsername } });
        } catch (error) {
          console.log(error);
        }
      };

      getChatData();
    }
  }, [recipientUsername, getChat, getRecipient]);

  /*
    To update the query when receiving a message from a user if you are in his 
    chat, and the chat doesn´t exist yet.
  */
  useEffect(() => {
    subscribeToMore<OnNewMessageAddedSubscription>({
      document: OnNewMessageAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || !recipientUsername) return prev;

        const { newMessage } = subscriptionData.data;
        const recipientExists = newMessage.users?.some(
          (u) => u.username === recipientUsername
        );

        if (
          recipientExists &&
          Object.keys(prev).length === 0 &&
          !newMessage.group
        ) {
          console.log("Refetching chat...");
          refetchChat({ recipientUsername });
        }

        return prev;
      },
    });
  }, [subscribeToMore, recipientUsername, refetchChat]);

  const sendMessageHandler = async (text: string) => {
    try {
      if (!recipientData) {
        throw new Error("Cannot send the message");
      }

      const chatId = chatData?.getChat._id;

      if (chatId) {
        await addMessage({
          variables: {
            chatData: {
              text,
              chatId,
            },
          },
        });
      } else {
        const recipients = [recipientData.getUser._id];
        await createNewChat({
          variables: {
            chatData: {
              recipients,
              text,
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  let messages;
  if (chatData && authUser && recipientData) {
    messages = chatData.getChat.messages.map((msg) => {
      const isSentByMe = Boolean(msg.sender && msg.sender._id === authUser._id);

      return (
        <Message
          key={msg._id}
          sender={isSentByMe ? authUser : recipientData.getUser}
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
          name={recipientData?.getUser.fullname || ""}
          imageUrl={recipientData?.getUser.profileImg?.url}
        />
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
