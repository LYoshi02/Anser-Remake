import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Push from "push.js";
import Router from "next/router";

import ChatItem from "./ChatItem";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  OnNewMessageAddedDocument,
  OnNewMessageAddedSubscription,
  useGetChatsQuery,
} from "@/graphql/generated";
import { ListSkeleton } from "@/components/UI";

const ChatsList = () => {
  const { authUser } = useAuthUser();
  const { data: chatsData, loading, subscribeToMore } = useGetChatsQuery();

  useEffect(() => {
    const unsubscribe = subscribeToMore<OnNewMessageAddedSubscription>({
      document: OnNewMessageAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {
          chatId,
          message: newMessage,
          users: messageUsers,
          group,
        } = subscriptionData.data.newMessage;

        let messageTitle, messageIcon, messageLink: string;
        if (group) {
          messageTitle = group.name;
          messageIcon = group.image?.url;
          messageLink = `/chats/group/${chatId}`;
        } else {
          const senderData = messageUsers?.find(
            (u) => u._id === newMessage.sender?._id
          );
          messageTitle = senderData?.fullname || "Anser";
          messageIcon = senderData?.profileImg?.url;
          messageLink = senderData
            ? `/chats/user/${senderData.username}`
            : "/chats";
        }

        console.log(Router.asPath);
        if (Router.asPath !== messageLink || !document.hasFocus()) {
          Push.create(messageTitle, {
            body: newMessage.text,
            icon: messageIcon,
            timeout: 8000,
            tag: "new-message",
            onClick: async () => {
              await Router.push(messageLink);
              window.focus();
              Push.close("new-message");
            },
          });
        }

        const changedChatIndex = prev.getChats.findIndex(
          (c) => c._id === chatId
        );

        const updatedChats = [...prev.getChats];

        let unreadMessagesAdd = 0;
        if (
          newMessage.sender != null &&
          newMessage.sender._id !== authUser?._id
        ) {
          unreadMessagesAdd = 1;
        }

        if (changedChatIndex === -1) {
          updatedChats.unshift({
            __typename: "Chat",
            _id: chatId,
            messages: [newMessage],
            users: messageUsers!,
            group,
            unreadMessages: unreadMessagesAdd,
          });
        } else {
          const previousUnreadMessagesNum =
            prev.getChats[changedChatIndex].unreadMessages || 0;
          let updatedUnreadMessagesNum =
            previousUnreadMessagesNum + unreadMessagesAdd;

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

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, authUser]);

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
