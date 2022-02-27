import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { useGroupContext } from "../../../stores/GroupContext";
import Member from "./Member";

type Props = {
  onOpenModal: () => void;
};

const Members = (props: Props) => {
  const {
    state: { isAdmin, members },
  } = useGroupContext();

  return (
    <Box>
      <Flex justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="lg">
          Members {`(${members.length})`}
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
        {members.map((member) => (
          <Member key={member.id} user={member} />
        ))}
      </Box>
    </Box>
  );
};

export default Members;
