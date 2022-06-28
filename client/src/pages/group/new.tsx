import type { NextPage } from "next";
import { Box, useDisclosure } from "@chakra-ui/react";

import { AppLayout } from "@/components/Layout";
import { BackNav } from "@/components/UI";
import {
  CreateGroupBtn,
  CreateGroupModal,
  UsersSelection,
} from "@/features/group";
import { useUsersSelection } from "@/features/group";
import { useGetUsersQuery } from "@/graphql/generated";

const NewGroupPage: NextPage = () => {
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const { data: usersData, loading } = useGetUsersQuery();
  const { selectedUsers, onSelectUser } = useUsersSelection();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!usersData) {
    return <p>Users not found</p>;
  }

  const onCreateNewGroup = (groupName: string) => {
    console.log(groupName);
    onCloseModal();
  };

  return (
    <AppLayout>
      <Box width="100%" flexGrow="1">
        <BackNav />
        <Box p="2">
          <UsersSelection
            users={usersData.getUsers}
            selectedUsers={selectedUsers}
            onUserSelected={onSelectUser}
          />
          {selectedUsers.length > 0 && <CreateGroupBtn clicked={onOpenModal} />}
          {isModalOpen && (
            <CreateGroupModal
              isOpen={isModalOpen}
              onClose={onCloseModal}
              onCreateGroup={onCreateNewGroup}
            />
          )}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default NewGroupPage;
