import type { NextPage } from "next";
import { useRouter } from "next/router";
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
import { useCreateNewGroupMutation } from "@/graphql/generated";

const NewGroupPage: NextPage = () => {
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const { selectedUsers, onSelectUser } = useUsersSelection();
  const [createNewGroup] = useCreateNewGroupMutation();
  const router = useRouter();

  const createNewGroupHandler = async (groupName: string) => {
    const groupMembersIds = selectedUsers.map((u) => u._id);

    await createNewGroup({
      variables: {
        groupData: {
          groupName,
          groupMembers: groupMembersIds,
        },
      },
    });

    await router.replace("/chats");
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
