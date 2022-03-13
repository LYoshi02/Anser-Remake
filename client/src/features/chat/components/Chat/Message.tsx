import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

type Props = {
  sender: {
    _id: string;
    fullname: string;
  };
  text: string;
  userId: string;
};

const Message = ({ sender, text, userId }: Props) => {
  const colorYellow = useColorModeValue("yellow.300", "purple.700");
  const colorGray = useColorModeValue("gray.200", "gray.700");

  const sentByMe = sender._id === userId;
  let messagePosition = sentByMe ? "flex-end" : "flex-start";

  return (
    <Flex my="2" direction="row" justify={messagePosition} align="center">
      {!sentByMe && <Avatar size="sm" mr="2" name={sender.fullname} />}
      <Box>
        {!sentByMe && <Text fontSize="sm">{sender.fullname}</Text>}
        <Box
          rounded="md"
          px="3"
          py="1"
          bgColor={sentByMe ? colorYellow : colorGray}
          display="inline-block"
        >
          <Text>{text}</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Message;
