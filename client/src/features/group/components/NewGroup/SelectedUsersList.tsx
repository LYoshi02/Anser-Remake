import { ReactNode } from "react";
import { Badge, Box, Text, Wrap, WrapItem } from "@chakra-ui/react";

import { User } from "../../types";

type Props = {
  selectedUsers: User[];
};

const SelectedUsersList = ({ selectedUsers }: Props) => {
  let wrapItems: ReactNode = (
    <WrapItem opacity="0">
      <Badge>placeholder</Badge>
    </WrapItem>
  );

  if (selectedUsers.length > 0) {
    wrapItems = selectedUsers.map((user) => (
      <WrapItem key={user._id}>
        <Badge key={user._id} variant="subtle" colorScheme="purple">
          {user.fullname}
        </Badge>
      </WrapItem>
    ));
  }

  return (
    <Box mb="4">
      <Text fontSize="lg" mb="1">
        Members {`(${selectedUsers.length})`}:
      </Text>
      <Wrap overflow="auto">{wrapItems}</Wrap>
    </Box>
  );
};

export default SelectedUsersList;
