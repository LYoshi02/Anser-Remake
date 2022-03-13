import { Avatar, Icon, useColorModeValue } from "@chakra-ui/react";
import { HiUserGroup } from "react-icons/hi";

type Props = {
  onOpenModal: () => void;
};

const GroupImage = (props: Props) => {
  const groupBgColor = useColorModeValue("gray.300", "gray.500");
  const groupIconColor = useColorModeValue("white", "gray.200");

  return (
    <Avatar
      size="sm"
      bg={groupBgColor}
      icon={<Icon as={HiUserGroup} w={20} h={20} color={groupIconColor} />}
      alignSelf="center"
      mb="2"
      h="36"
      w="36"
      cursor="pointer"
      onClick={props.onOpenModal}
    />
  );
};

export default GroupImage;
