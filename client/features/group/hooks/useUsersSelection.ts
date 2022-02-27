import { useState } from "react";

import { User } from "@/types";

const useUsersSelection = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const onSelectUser = (user: User) => {
    setSelectedUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      const foundUserIndex = prevUsers.findIndex((u) => u.id === user.id);

      if (foundUserIndex !== -1) {
        updatedUsers.splice(foundUserIndex, 1);
      } else {
        updatedUsers.push(user);
      }

      return updatedUsers;
    });
  };

  const getSelectedUsersId = () => {
    return selectedUsers.map((user) => user.id);
  };

  return { selectedUsers, onSelectUser, getSelectedUsersId };
};

export default useUsersSelection;
