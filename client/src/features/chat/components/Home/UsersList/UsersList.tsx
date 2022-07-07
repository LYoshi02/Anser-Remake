import { ReactNode } from "react";

import UserItem from "./UserItem";
import { useGetUsers } from "@/hooks/useGetUsers";
import UsersSearch from "@/components/Users/UsersSearch";

// TODO: add variables to the query
const UsersList = () => {
  const { reqLoading, users, onFetchMoreUsers, onSearchUser } = useGetUsers({
    fetchLimit: 20,
  });

  let userItems: ReactNode[] = [];
  if (users) {
    userItems = users.getUsers.map((user) => (
      <UserItem
        key={user._id}
        username={user.username}
        fullname={user.fullname}
        imageUrl={user.profileImg?.url}
      />
    ));
  }

  return (
    <UsersSearch
      isLoading={reqLoading}
      userItems={userItems}
      onSearchUser={onSearchUser}
      onFetchMore={onFetchMoreUsers}
    />
  );
};

export default UsersList;
