import { Box } from "@chakra-ui/react";

import UserItem from "./UserItem";
import { sampleUsers } from "@/sampleData";

const UsersList = () => {
  return (
    <Box>
      {sampleUsers.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </Box>
  );
};

export default UsersList;
