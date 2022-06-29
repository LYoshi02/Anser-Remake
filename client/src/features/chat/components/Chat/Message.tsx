import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

type Props = {
  sender?: {
    _id: string;
    fullname: string;
    profileImg?: {
      url: string;
    } | null;
  } | null;
  text: string;
  sentByMe: boolean;
};

const Message = ({ sender, text, sentByMe }: Props) => {
  const colorYellow = useColorModeValue("yellow.300", "purple.700");
  const colorGray = useColorModeValue("gray.200", "gray.700");

  let messagePosition = "flex-end";
  let senderAvatar, senderName;
  if (!sender) {
    messagePosition = "center";
  } else if (!sentByMe) {
    messagePosition = "flex-start";
    senderAvatar = (
      <Avatar
        size="sm"
        mr="2"
        name={sender.fullname}
        src={sender.profileImg?.url}
      />
    );

    senderName = <Text fontSize="sm">{sender.fullname}</Text>;
  }

  return (
    <Flex my="2" direction="row" justify={messagePosition} align="center">
      {senderAvatar}
      <Box>
        {senderName}
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
