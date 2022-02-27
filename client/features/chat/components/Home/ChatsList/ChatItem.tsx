import { AvatarProps, Box, Icon, useColorModeValue } from "@chakra-ui/react";
import { HiUserGroup } from "react-icons/hi";

import { Link, ListItem } from "@/components/UI";
import { Chat } from "@/types";

type Props = {
  chat: Chat;
};

const ChatItem = ({ chat }: Props) => {
  const groupBgColor = useColorModeValue("gray.300", "gray.500");
  const groupIconColor = useColorModeValue("white", "gray.200");

  let avatarProps: AvatarProps;
  let chatName = "";
  let chatUrl = "";

  if (chat.group) {
    avatarProps = {
      bg: groupBgColor,
      name: chat.group.name,
      icon: <Icon as={HiUserGroup} w={8} h={8} color={groupIconColor} />,
      src: "",
    };
    chatName = chat.group.name;
    chatUrl = `/chats/group/${chat.id}`;
  } else {
    const receiver = chat.users.find((user) => user.id !== "1");
    avatarProps = {
      name: receiver?.fullname,
      src: "",
    };
    chatName = receiver?.fullname || "";
    chatUrl = `/chats/user/${receiver?.username}`;
  }

  const lastMessage = chat.messages[chat.messages.length - 1].text;

  let newMessage;
  if (chat.newMessage) {
    newMessage = <Box w="3" h="3" bgColor="purple.600" rounded="full"></Box>;
  }

  return (
    <Link href={chatUrl}>
      <ListItem
        avatar={avatarProps}
        title={chatName}
        description={lastMessage}
        detail={newMessage}
      />
    </Link>
  );
};

export default ChatItem;
