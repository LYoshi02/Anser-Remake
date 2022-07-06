import { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiPaperAirplane } from "react-icons/hi";

type Props = {
  isMember?: boolean;
  onSendMessage: (msg: string) => void;
};

const MessageInput = ({ onSendMessage, isMember = true }: Props) => {
  const [text, setText] = useState("");
  const inputBgColor = useColorModeValue("gray.100", "gray.900");
  const colorGray = useColorModeValue("gray.300", "gray.700");

  const sendMessageHandler = () => {
    const trimmedText = text.trim();

    if (trimmedText.length === 0) return;

    onSendMessage(trimmedText);
    setText("");
  };

  if (!isMember) {
    return (
      <Box textAlign="center" bgColor={colorGray} p="2">
        <Text>Ya no perteneces a este grupo</Text>
      </Box>
    );
  }

  return (
    <Flex p="2">
      <Input
        placeholder="Write your message..."
        mr="2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessageHandler() : null)}
        required
        bgColor={inputBgColor}
      />
      <IconButton
        aria-label="Send Message"
        colorScheme="purple"
        icon={<HiPaperAirplane />}
        rounded="full"
        sx={{ transform: "rotateZ(90deg)" }}
        onClick={sendMessageHandler}
      />
    </Flex>
  );
};

export default MessageInput;
