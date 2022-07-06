import { Button } from "@chakra-ui/react";

import { useGroupContext } from "../../../stores/GroupContext";
import useUsersSelection from "../../../hooks/useUsersSelection";
import UsersSelection from "../../UsersSelection/UsersSelection";
import { Modal } from "@/components/UI";
import { useAddUsersToGroupMutation } from "@/graphql/generated";
import { useToast } from "@/hooks/useToast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MembersModal = (props: Props) => {
  const {
    data: { getGroupData },
  } = useGroupContext();
  const {
    selectedUsers: selectedMembers,
    onSelectUser: onSelectMember,
    getSelectedUsersId: getSelectedMembersId,
    restartSelectedUsers,
  } = useUsersSelection();
  const [addUsers, { loading: reqLoading }] = useAddUsersToGroupMutation();
  const toast = useToast();

  const groupUsersIds = getGroupData.users.map((u) => u._id);

  const addMembersHandler = async () => {
    const membersIds = getSelectedMembersId();

    try {
      const res = await addUsers({
        variables: {
          addUsersArgs: {
            chatId: getGroupData._id,
            newUsers: membersIds,
          },
        },
      });

      if (res.data) {
        toast({
          status: "success",
          title: "Success",
          description: "Members added successfully",
        });
      }

      restartSelectedUsers();
    } catch (e) {}

    props.onClose();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      modalProps={{ isCentered: true }}
      modalBodyProps={{ overflow: "auto", maxHeight: "50vh" }}
      title="Add New Members"
      body={
        <UsersSelection
          excludedUsers={groupUsersIds}
          selectedUsers={selectedMembers}
          onUserSelected={onSelectMember}
        />
      }
      footer={
        <Button
          colorScheme="purple"
          isDisabled={selectedMembers.length === 0}
          onClick={addMembersHandler}
          isLoading={reqLoading}
        >
          Add
        </Button>
      }
    />
  );
};

export default MembersModal;
