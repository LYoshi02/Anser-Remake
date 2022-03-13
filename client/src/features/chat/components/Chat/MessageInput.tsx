import { useState } from "react";
import { Flex, IconButton, Input, useColorModeValue } from "@chakra-ui/react";
import { HiPaperAirplane } from "react-icons/hi";

type Props = {
  onSendMessage: (msg: string) => void;
};

const MessageInput = (props: Props) => {
  const [text, setText] = useState("");
  const inputBgColor = useColorModeValue("gray.100", "gray.900");

  const sendMessageHandler = () => {
    props.onSendMessage(text);
    setText("");
  };

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
