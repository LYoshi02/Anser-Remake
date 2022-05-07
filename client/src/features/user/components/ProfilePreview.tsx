import { Avatar, Box, Center, Icon, IconButton, Text } from "@chakra-ui/react";
import { HiPhotograph } from "react-icons/hi";

import { Link } from "@/components/UI";

type Props = {
  fullname: string;
  username: string;
  profileImageUrl?: string;
};

const ProfilePreview = (props: Props) => {
  return (
    <Center flexDir="column">
      <Box position="relative">
        <Avatar
          src={props.profileImageUrl}
          name={props.fullname}
          size="2xl"
        ></Avatar>
        <Link href="/profile/image">
          <IconButton
            aria-label="Add Profile Image"
            position="absolute"
            bottom="0"
            right="1"
            rounded="full"
            colorScheme="yellow"
            icon={<Icon as={HiPhotograph} w="5" h="5" />}
          />
        </Link>
      </Box>
      <Text fontSize="3xl" mt="2" fontWeight="bold">
        @{props.username}
      </Text>
    </Center>
  );
};

export default ProfilePreview;
