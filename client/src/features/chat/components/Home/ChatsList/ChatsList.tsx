import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import ChatItem from "./ChatItem";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  OnNewChatAddedDocument,
  OnNewChatAddedSubscription,
  OnNewMessageAddedDocument,
  OnNewMessageAddedSubscription,
  useGetChatsQuery,
} from "@/graphql/generated";

// TODO: add an alert when there are messages that haven't been read
const ChatsList = () => {
  const user = useAuthUser({ redirectTo: "/login" });
  const {
    data: chatsData,
    loading,
    subscribeToMore,
    error,
  } = useGetChatsQuery();

  console.log(error);

  useEffect(() => {
    subscribeToMore<OnNewChatAddedSubscription>({
      document: OnNewChatAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newChat = subscriptionData.data.newChat;

        return Object.assign({}, prev, {
          getChats: [newChat, ...prev.getChats],
        });
      },
    });

    subscribeToMore<OnNewMessageAddedSubscription>({
      document: OnNewMessageAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        if (!subscriptionData.data) return prev;

        const {
          chatId,
          message: newMessage,
          users: updatedUsers,
        } = subscriptionData.data.newMessage;
        const changedChatIndex = prev.getChats.findIndex(
          (c) => c._id === chatId
        );

        if (changedChatIndex === -1) return prev;

        const updatedChat = {
          ...prev.getChats[changedChatIndex],
          messages: [...prev.getChats[changedChatIndex].messages, newMessage],
          users: updatedUsers || prev.getChats[changedChatIndex].users,
        };

        const updatedChats = [...prev.getChats];
        updatedChats.splice(changedChatIndex, 1);
        updatedChats.unshift(updatedChat);

        return Object.assign({}, prev, {
          getChats: updatedChats,
        });
      },
    });
  }, [subscribeToMore]);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  if (!chatsData) {
    return <p>Chats not found</p>;
  }

  return (
    <Box>
      {chatsData.getChats.map((chat) => (
        <ChatItem key={chat._id} chat={chat} userId={user._id} />
      ))}
    </Box>
  );
};

export default ChatsList;
