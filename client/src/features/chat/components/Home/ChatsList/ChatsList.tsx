import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import ChatItem from "./ChatItem";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  OnNewMessageAddedDocument,
  OnNewMessageAddedSubscription,
  useGetChatsQuery,
} from "@/graphql/generated";
import { ListSkeleton } from "@/components/UI";

// TODO: add an alert when there are messages that haven't been read
const ChatsList = () => {
  const { authUser } = useAuthUser();
  const { data: chatsData, loading, subscribeToMore } = useGetChatsQuery();

  useEffect(() => {
    subscribeToMore<OnNewMessageAddedSubscription>({
      document: OnNewMessageAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
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
          updatedChats.unshift({
            __typename: "Chat",
            _id: chatId,
            messages: [newMessage],
            users: messageUsers!,
            group,
            unreadMessages: 1,
          });
        } else {
          const previousUnreadMessagesNum =
            prev.getChats[changedChatIndex].unreadMessages || 0;
          const updatedUnreadMessagesNum = previousUnreadMessagesNum + 1;
          const updatedChat = {
            ...prev.getChats[changedChatIndex],
            messages: [...prev.getChats[changedChatIndex].messages, newMessage],
            users: messageUsers || prev.getChats[changedChatIndex].users,
            group: group || prev.getChats[changedChatIndex].group,
            unreadMessages: updatedUnreadMessagesNum,
          };

          updatedChats.splice(changedChatIndex, 1);
          updatedChats.unshift(updatedChat);
        }

        return Object.assign({}, prev, {
          getChats: updatedChats,
        });
      },
    });
  }, [subscribeToMore]);

  if (loading || !authUser) {
    return <ListSkeleton itemsNumber={10} />;
  }

  if (!chatsData) {
    return null;
  }

  return (
    <Box>
      {chatsData.getChats.map((chat) => (
        <ChatItem key={chat._id} chat={chat} userId={authUser._id} />
      ))}
    </Box>
  );
};

export default ChatsList;
