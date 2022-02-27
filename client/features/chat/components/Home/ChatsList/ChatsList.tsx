import { Box } from "@chakra-ui/react";

import ChatItem from "./ChatItem";
import { sampleChats } from "@/sampleData";

const ChatsList = () => {
  return (
    <Box>
      {sampleChats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </Box>
  );
};

export default ChatsList;
