import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { useGroupContext } from "../../../stores/GroupContext";
import Member from "./Member";

type Props = {
  onOpenModal: () => void;
};

const Members = (props: Props) => {
  const {
    data: { getGroupData },
    authUserId,
  } = useGroupContext();

  const groupUsers = getGroupData.users;
  const isAdmin = getGroupData.group!.admins.some((a) => a._id === authUserId);

  console.log(groupUsers);

  return (
    <Box>
      <Flex justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="lg">
          Members {`(${groupUsers.length})`}
        </Text>
        {isAdmin && (
          <Button
            colorScheme="purple"
            variant="ghost"
            onClick={props.onOpenModal}
          >
            Add Members
          </Button>
        )}
      </Flex>
      <Box my="2">
        {groupUsers.map((user) => (
          <Member key={user._id} user={user} isAdmin={isAdmin} />
        ))}
      </Box>
    </Box>
  );
};

export default Members;
