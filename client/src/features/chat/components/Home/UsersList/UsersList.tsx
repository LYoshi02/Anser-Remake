import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import UserItem from "./UserItem";
import {
  useGetUsersQuery,
  OnNewUserAddedDocument,
  OnNewUserAddedSubscription,
} from "@/graphql/generated";

const UsersList = () => {
  const { data: usersData, loading, subscribeToMore } = useGetUsersQuery();

  useEffect(() => {
    console.log("montado");
    subscribeToMore<OnNewUserAddedSubscription>({
      document: OnNewUserAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(prev, subscriptionData);
        if (!subscriptionData.data) return prev;
        const newUser = subscriptionData.data.newUser;

        return Object.assign({}, prev, {
          getUsers: [{ ...newUser }, ...prev.getUsers],
        });
      },
    });
  }, [subscribeToMore]);

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
