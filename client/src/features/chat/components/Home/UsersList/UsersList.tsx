import { ReactNode } from "react";

import UserItem from "./UserItem";
import { useGetUsers } from "@/hooks/useGetUsers";
import { UsersSearch } from "@/components/Users";

const UsersList = () => {
  const {
    reqLoading,
    isFetchingMore,
    users,
    keepFetching,
    onFetchMoreUsers,
    onSearchUser,
  } = useGetUsers({});

  let userItems: ReactNode[] = [];
  if (users) {
    userItems = users.getUsers.map((user) => (
      <UserItem
        key={user._id}
        username={user.username}
        fullname={user.fullname}
        imageUrl={user.profileImg?.url}
        isNewUser={user.isNewUser}
      />
    ));
  }

  return (
    <UsersSearch
      isLoading={reqLoading}
      isFetchingMore={isFetchingMore}
      userItems={userItems}
      keepFetching={keepFetching}
      onSearchUser={onSearchUser}
      onFetchMore={onFetchMoreUsers}
    />
  );
};

export default UsersList;
