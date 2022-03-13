import { Box } from "@chakra-ui/react";

import UserItem from "./UserItem";
import { useGetUsersQuery } from "@/graphql/generated";

const UsersList = () => {
  const { data: usersData, loading } = useGetUsersQuery();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!usersData) {
    return <p>Users not found</p>;
  }

  return (
    <Box>
      {usersData.getUsers.map((user) => (
        <UserItem
          key={user._id}
          username={user.username}
          fullname={user.fullname}
        />
      ))}
    </Box>
  );
};

export default UsersList;
