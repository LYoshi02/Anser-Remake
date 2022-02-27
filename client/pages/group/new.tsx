import type { NextPage } from "next";
import { Box, useDisclosure } from "@chakra-ui/react";

import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import {
  CreateGroupBtn,
  CreateGroupModal,
  SelectedUsers,
  UsersSelection,
} from "@/features/group";
import { useUsersSelection } from "@/features/group";
import { sampleUsers } from "@/sampleData";

const NewGroupPage: NextPage = () => {
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const { selectedUsers, onSelectUser } = useUsersSelection();

  const filteredUsers = sampleUsers.filter((user) => user.id !== "1");

  return (
    <AppLayout>
      <Box width="100%" flexGrow="1">
        <BackNav />
        <Box p="2">
          <SelectedUsers selectedUsers={selectedUsers} />
          <UsersSelection
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onUserSelected={onSelectUser}
          />
          {selectedUsers.length > 0 && <CreateGroupBtn clicked={onOpenModal} />}
          {isModalOpen && (
            <CreateGroupModal isOpen={isModalOpen} onClose={onCloseModal} />
          )}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default NewGroupPage;
