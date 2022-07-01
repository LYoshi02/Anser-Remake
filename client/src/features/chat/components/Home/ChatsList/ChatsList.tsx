import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import ChatItem from "./ChatItem";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  OnNewMessageAddedDocument,
  OnNewMessageAddedSubscription,
  useGetChatsQuery,
} from "@/graphql/generated";

// TODO: add an alert when there are messages that haven't been read
const ChatsList = () => {
  const user = useAuthUser({ redirectTo: "/login" });
  const { data: chatsData, loading, subscribeToMore } = useGetChatsQuery();

  useEffect(() => {
    subscribeToMore<OnNewMessageAddedSubscription>({
      document: OnNewMessageAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        console.log("New message: ", subscriptionData);
        if (!subscriptionData.data) return prev;

        const {
          chatId,
          message: newMessage,
          users: messageUsers,
          group,
        } = subscriptionData.data.newMessage;
        const changedChatIndex = prev.getChats.findIndex(
          (c) => c._id === chatId
        );

        const updatedChats = [...prev.getChats];

        if (changedChatIndex === -1) {
          const newChat = {
            _id: chatId,
            messages: [newMessage],
            users: messageUsers!,
            group,
          };
          updatedChats.unshift(newChat);
        } else {
          const updatedChat = {
            ...prev.getChats[changedChatIndex],
            messages: [...prev.getChats[changedChatIndex].messages, newMessage],
            users: messageUsers || prev.getChats[changedChatIndex].users,
          };

          updatedChats.splice(changedChatIndex, 1);
          updatedChats.unshift(updatedChat);
        }

        console.log("Previous chats: ", prev.getChats);
        console.log("Updated chats: ", updatedChats);

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
