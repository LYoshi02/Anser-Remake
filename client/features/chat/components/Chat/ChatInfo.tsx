import {
  Avatar,
  AvatarProps,
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiUserGroup } from "react-icons/hi";

type Props = {
  name: string;
  isGroup?: boolean;
};

const ChatInfo = (props: Props) => {
  const groupBgColor = useColorModeValue("gray.300", "gray.500");
  const groupIconColor = useColorModeValue("white", "gray.200");

  let avatarProps: AvatarProps;
  if (props.isGroup) {
    avatarProps = {
      bg: groupBgColor,
      icon: <Icon as={HiUserGroup} w={5} h={5} color={groupIconColor} />,
    };
  } else {
    avatarProps = {
      name: props.name,
    };
  }

  return (
    <Flex align="center" ml="2" w="full">
      <Box>
        <Avatar size="sm" mr="2" {...avatarProps} />
      </Box>
      <Box>
        <Text fontWeight="bold" color="white" lineHeight="5">
          {props.name}
        </Text>
      </Box>
    </Flex>
  );
};

export default ChatInfo;
