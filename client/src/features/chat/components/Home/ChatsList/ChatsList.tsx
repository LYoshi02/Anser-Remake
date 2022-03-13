import { Box } from "@chakra-ui/react";

import ChatItem from "./ChatItem";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useGetChatsQuery } from "@/graphql/generated";

const ChatsList = () => {
  const user = useAuthUser({ redirectTo: "/login" });
  const { data: chatsData, loading, error } = useGetChatsQuery();

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
