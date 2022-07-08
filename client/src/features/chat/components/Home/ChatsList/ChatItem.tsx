import { AvatarProps, Icon, useColorModeValue } from "@chakra-ui/react";
import { HiUserGroup } from "react-icons/hi";

import { Link, ListItem } from "@/components/UI";

type Chat = {
  _id: string;
  users: {
    _id: string;
    fullname: string;
    username: string;
    profileImg?: { url: string } | null;
  }[];
  messages: {
    _id: string;
    text: string;
    sender?: {
      _id: string;
    } | null;
  }[];
  group?: {
    name: string;
    image?: { url: string } | null;
  } | null;
  newMessage?: boolean;
};

type Props = {
  chat: Chat;
  userId: string;
};

const ChatItem = ({ chat, userId }: Props) => {
  const groupBgColor = useColorModeValue("gray.300", "gray.500");
  const groupIconColor = useColorModeValue("white", "gray.200");

  let avatarProps: AvatarProps;
  let chatName = "";
  let chatUrl = "";

  const lastMessage = chat.messages[chat.messages.length - 1];
  let lastMessageText = lastMessage.text;

  console.log(chat);

  if (chat.group) {
    avatarProps = {
      bg: groupBgColor,
      icon: <Icon as={HiUserGroup} w={8} h={8} color={groupIconColor} />,
      src: chat.group.image?.url,
    };
    chatName = chat.group.name;
    chatUrl = `/chats/group/${chat._id}`;

    const lastMessageSender = chat.users.find(
      (u) => u._id === lastMessage.sender?._id
    );
    if (lastMessageSender) {
      const senderFirstName = lastMessageSender.fullname.split(" ")[0];
      lastMessageText = `${senderFirstName}: ${lastMessageText}`;
    }
  } else {
    const receiver = chat.users.find((user) => user._id !== userId);
    avatarProps = {
      name: receiver?.fullname || "",
      src: receiver?.profileImg?.url,
    };
    chatName = receiver?.fullname || "";
    chatUrl = `/chats/user/${receiver?.username}`;
  }

  return (
    <Link href={chatUrl}>
      <ListItem
        avatar={avatarProps}
        title={chatName}
        description={lastMessageText}
        descriptionProps={{ noOfLines: 1 }}
      />
    </Link>
  );
};

export default ChatItem;
