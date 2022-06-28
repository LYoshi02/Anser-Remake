import { Box, Icon, useColorModeValue } from "@chakra-ui/react";
import { IoMdCheckbox } from "react-icons/io";

import SearchInput from "../Inputs/SearchInput";
import { User } from "../../types";
import { ListItem } from "@/components/UI";
import SelectedUsersList from "./SelectedUsersList";

type Props = {
  users: User[];
  selectedUsers: User[];
  onUserSelected: (user: User) => void;
};

const UsersSelection = ({ users, selectedUsers, onUserSelected }: Props) => {
  const checkIconColor = useColorModeValue("yellow.500", "yellow.300");

  const findSelectedUser = (userId: string) => {
    return selectedUsers.some((u) => u._id === userId);
  };

  return (
    <>
      <SelectedUsersList selectedUsers={selectedUsers} />
      <Box pb="10">
        <SearchInput />
        {users.map((user) => {
          const isSelected = findSelectedUser(user._id);

          return (
            <ListItem
              key={user._id}
              avatar={{ name: user.fullname }}
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
        })}
      </Box>
    </>
  );
};

export default UsersSelection;
