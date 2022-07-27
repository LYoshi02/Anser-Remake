import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";

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

  const groupUsers = useMemo(() => {
    return [...getGroupData.users].sort((u1, u2) => {
      if (u1.fullname > u2.fullname) {
        return 1;
      }
      if (u1.fullname < u2.fullname) {
        return -1;
      }
      return 0;
    });
  }, [getGroupData.users]);
  const isAdmin = getGroupData.group!.admins.some((a) => a._id === authUserId);

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
