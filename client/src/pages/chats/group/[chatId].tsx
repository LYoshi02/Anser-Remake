import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { ChatBody, ChatInfo, GroupMenu, MessageInput } from "@/features/chat";
import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import {
  useAddMessageMutation,
  useGetGroupChatLazyQuery,
  useLeaveGroupMutation,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";

const GroupChatPage: NextPage = () => {
  const router = useRouter();
  const authUser = useAuthUser({ redirectTo: "/login" });
  const [getGroupChat, { data: chatData, loading: reqLoading }] =
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
        } catch (e) {}
      };

      getChatData();
    }
  }, [chatId, getGroupChat]);

  const leaveGroupHandler = async () => {
    try {
      await leaveGroup({
        variables: {
          chatId,
        },
      });
    } catch (e) {}
  };

  const sendMessageHandler = async (text: string) => {
    if (!chatId) return;

    try {
      await addMessage({
        variables: {
          chatData: {
            text,
            chatId,
          },
        },
      });
    } catch (e) {}
  };

  let isMember = null;
  if (chatData && authUser) {
    isMember = chatData.getGroupChat.users.some((u) => u._id === authUser._id);
  }

  let messageInput;
  if (!reqLoading && isMember != null) {
    messageInput = (
      <MessageInput isMember={isMember} onSendMessage={sendMessageHandler} />
    );
  }

  let groupMenu;
  if (isMember) {
    groupMenu = <GroupMenu chatId={chatId} onLeaveGroup={leaveGroupHandler} />;
  }

  return (
    <AppLayout>
      <BackNav>
        <ChatInfo
          name={chatData?.getGroupChat.group?.name || ""}
          imageUrl={chatData?.getGroupChat.group?.image?.url}
          isGroup
        />
        {groupMenu}
      </BackNav>
      <ChatBody
        messages={chatData?.getGroupChat.messages}
        authUserId={authUser?._id}
        messageInput={messageInput}
      />
    </AppLayout>
  );
};

export default GroupChatPage;
