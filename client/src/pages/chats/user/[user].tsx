import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Push from "push.js";

import {
  ChatBody,
  ChatInfo,
  MessageInput,
  useUpdateLastSeenOnExit,
} from "@/features/chat";
import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import {
  useAddMessageMutation,
  useCreateNewChatMutation,
  OnNewMessageAddedDocument,
  OnNewMessageAddedSubscription,
  useGetSingleChatLazyQuery,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";
import { clearUnreadMessages } from "@/features/chat/utils/chat";

const UserChatPage: NextPage = () => {
  const [
    getSingleChat,
    {
      data: chatData,
      subscribeToMore,
      refetch: refetchSingleChat,
      loading: chatReqLoading,
      client,
    },
  ] = useGetSingleChatLazyQuery({
    onCompleted: async (data) => {
      const chatData = data.getSingleChat.chat;
      if (chatData) {
        Push.close(chatData._id);
        clearUnreadMessages(client, chatData);
      }
    },
  });
  const [createNewChat] = useCreateNewChatMutation();
  const [addMessage] = useAddMessageMutation();
  const { authUser } = useAuthUser({ redirectTo: "/login" });
  const router = useRouter();

  const chatId = chatData?.getSingleChat.chat?._id;
  useUpdateLastSeenOnExit(chatId);

  const recipientUsername = router.query.user as string;

  useEffect(() => {
    if (recipientUsername) {
      const getChatData = async () => {
        try {
          await getSingleChat({
            variables: { recipientUsername },
          });
        } catch (e) {}
      };

      getChatData();
    }
  }, [recipientUsername, getSingleChat]);

  /*
    To update the query when receiving a message from a user if you are in his 
    chat, and the chat doesn´t exist yet.
  */
  useEffect(() => {
    if (!recipientUsername) return;

    const unsubscribe = subscribeToMore<OnNewMessageAddedSubscription>({
      document: OnNewMessageAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { newMessage } = subscriptionData.data;
        const recipientExists = newMessage.users?.some(
          (u) => u.username === recipientUsername
        );

        if (recipientExists && !prev.getSingleChat.chat && !newMessage.group) {
          refetchSingleChat({ recipientUsername });
        }

        return prev;
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, recipientUsername, refetchSingleChat]);

  const sendMessageHandler = async (text: string) => {
    if (!chatData) return;

    try {
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
        await createNewChat({
          variables: {
            chatData: {
              recipients: [chatData!.getSingleChat.recipient._id],
              text,
            },
          },
        });
      }
    } catch (e) {}
  };

  let messageInput;
  if (!chatReqLoading && chatData) {
    messageInput = <MessageInput onSendMessage={sendMessageHandler} />;
  }

  return (
    <AppLayout>
      <BackNav>
        <ChatInfo
          name={chatData?.getSingleChat.recipient.fullname || ""}
          imageUrl={chatData?.getSingleChat.recipient.profileImg?.url}
        />
      </BackNav>
      <ChatBody
        messages={chatData?.getSingleChat.chat?.messages}
        authUserId={authUser?._id}
        messageInput={messageInput}
      />
    </AppLayout>
  );
};

export default UserChatPage;
