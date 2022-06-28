import type { NextPage } from "next";
import { Box, useDisclosure } from "@chakra-ui/react";

import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import {
  CreateGroupBtn,
  CreateGroupModal,
  SelectedUsersList,
  UsersSelection,
  useUsersSelection,
} from "@/features/group";

const NewGroupPage: NextPage = () => {
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const { selectedUsers, onSelectUser } = useUsersSelection();

  const createNewGroupHandler = (groupName: string) => {
    console.log(groupName, selectedUsers);
    onCloseModal();
  };

  return (
    <AppLayout>
      <Box width="100%" flexGrow="1">
        <BackNav />
        <Box p="2">
          <SelectedUsersList selectedUsers={selectedUsers} />
          <UsersSelection
            selectedUsers={selectedUsers}
            onUserSelected={onSelectUser}
          />
          {selectedUsers.length > 0 && <CreateGroupBtn clicked={onOpenModal} />}
          {isModalOpen && (
            <CreateGroupModal
              isOpen={isModalOpen}
              onClose={onCloseModal}
              onCreateGroup={createNewGroupHandler}
            />
          )}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default NewGroupPage;
