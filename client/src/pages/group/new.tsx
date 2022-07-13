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
import { useToast } from "@/hooks/useToast";
import { useAuthUser } from "@/hooks/useAuthUser";

const NewGroupPage: NextPage = () => {
  const {} = useAuthUser({ redirectTo: "/login" });
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const { selectedUsers, onSelectUser, getSelectedUsersId } =
    useUsersSelection();
  const [createNewGroup, { loading: reqLoading }] = useCreateNewGroupMutation();
  const toast = useToast();
  const router = useRouter();

  const createNewGroupHandler = async (groupName: string) => {
    const groupMembersIds = getSelectedUsersId();

    try {
      const res = await createNewGroup({
        variables: {
          groupData: {
            groupName,
            groupUsers: groupMembersIds,
          },
        },
      });

      if (res.data) {
        onCloseModal();
        toast({
          status: "success",
          title: "Success",
          description: "Group created successfully",
        });
      }

      router.replace("/chats");
    } catch (e) {}
  };

  return (
    <AppLayout>
      <Box width="100%">
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
              isLoading={reqLoading}
            />
          )}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default NewGroupPage;
