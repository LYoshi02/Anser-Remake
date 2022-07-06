import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { ChatBody, ChatInfo, MessageInput } from "@/features/chat";
import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
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
  const [
    getChat,
    {
      data: chatData,
      subscribeToMore,
      refetch: refetchChat,
      loading: chatReqLoading,
    },
  ] = useGetChatLazyQuery();
  const [getRecipient, { data: recipientData, loading: userReqLoading }] =
    useGetUserLazyQuery();
  const [createNewChat] = useCreateNewChatMutation();
  const [addMessage] = useAddMessageMutation();
  const authUser = useAuthUser({ redirectTo: "/login" });
  const router = useRouter();

  const recipientUsername = router.query.user as string;

  useEffect(() => {
    if (recipientUsername) {
      const getChatData = async () => {
        try {
          await getChat({
            variables: { recipientUsername },
          });

          await getRecipient({ variables: { username: recipientUsername } });
        } catch (e) {}
      };

      getChatData();
    }
  }, [recipientUsername, getChat, getRecipient]);

  /*
    To update the query when receiving a message from a user if you are in his 
    chat, and the chat doesn´t exist yet.
  */
  useEffect(() => {
    if (recipientUsername) {
      subscribeToMore<OnNewMessageAddedSubscription>({
        document: OnNewMessageAddedDocument,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

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
    }
  }, [subscribeToMore, recipientUsername, refetchChat]);

  const sendMessageHandler = async (text: string) => {
    if (!chatData && !recipientData) return;

    try {
      const chatId = chatData!.getChat._id;

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
              recipients: [recipientData!.getUser._id],
              text,
            },
          },
        });
      }
    } catch (e) {}
  };

  let messageInput;
  if (!chatReqLoading && !userReqLoading) {
    messageInput = <MessageInput onSendMessage={sendMessageHandler} />;
  }

  return (
    <AppLayout>
      <BackNav>
        <ChatInfo
          name={recipientData?.getUser.fullname || ""}
          imageUrl={recipientData?.getUser.profileImg?.url}
        />
      </BackNav>
      <ChatBody
        messages={chatData?.getChat.messages}
        authUserId={authUser?._id}
        messageInput={messageInput}
      />
    </AppLayout>
  );
};

export default UserChatPage;
