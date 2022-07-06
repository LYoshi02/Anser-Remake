import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";

import Message from "./Message";
import useScrollToBottom from "../../hooks/useScrollToBottom";

type Message = {
  _id: string;
  sender?: {
    _id: string;
    fullname: string;
    profileImg?: {
      url: string;
    } | null;
  } | null;
  text: string;
};

type Props = {
  messages: Message[] | undefined;
  authUserId: string | undefined;
  messageInput: ReactNode;
};

const ChatBody = ({ messages, authUserId, messageInput }: Props) => {
  const messagesEndRef = useScrollToBottom<HTMLDivElement>();

  let messagesElement;
  if (messages && authUserId) {
    messagesElement = messages.map((msg) => {
      const isSentByMe = Boolean(msg.sender && msg.sender._id === authUserId);

      return (
        <Message
          key={msg._id}
          sender={msg.sender}
          text={msg.text}
          sentByMe={isSentByMe}
        />
      );
    });
  }

  return (
    <Flex direction="column" justify="space-between" grow={1} overflow="hidden">
      <Box overflow="auto" p="2">
        {messagesElement}
        <div ref={messagesEndRef} />
      </Box>
      {messageInput}
    </Flex>
  );
};

export default ChatBody;
