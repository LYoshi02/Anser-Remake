import { ReactNode } from "react";
import { Icon, useColorModeValue } from "@chakra-ui/react";
import { IoMdCheckbox } from "react-icons/io";

import { User } from "../../types";
import { ListItem } from "@/components/UI";
import UsersSearch from "@/components/Users/UsersSearch";
import { useGetUsers } from "@/hooks/useGetUsers";

type Props = {
  selectedUsers: User[];
  onUserSelected: (user: User) => void;
  excludedUsers?: string[];
};

const UsersSelection = ({
  selectedUsers,
  onUserSelected,
  excludedUsers = [],
}: Props) => {
  const { reqLoading, users, onFetchMoreUsers, onSearchUser } = useGetUsers({
    fetchLimit: 20,
    excludedUsers,
  });
  const checkIconColor = useColorModeValue("yellow.500", "yellow.300");

  const findSelectedUser = (userId: string) => {
    return selectedUsers.some((u) => u._id === userId);
  };

  let userItems: ReactNode[] = [];
  if (users) {
    userItems = users.getUsers.map((user) => {
      const isSelected = findSelectedUser(user._id);

      return (
        <ListItem
          key={user._id}
          avatar={{ name: user.fullname, src: user.profileImg?.url }}
          title={user.fullname}
          description={`@${user.username}`}
          clicked={() => onUserSelected(user)}
          detail={
            isSelected ? (
              <Icon as={IoMdCheckbox} w="6" h="6" color={checkIconColor} />
            ) : undefined
          }
        />
      );
    });
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

export default UsersSelection;
