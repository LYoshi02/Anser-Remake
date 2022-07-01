import { Box, Button } from "@chakra-ui/react";

import { useGroupContext } from "../../../stores/GroupContext";
import useUsersSelection from "../../../hooks/useUsersSelection";
import UsersSelection from "../../UsersSelection/UsersSelection";
import { Modal } from "@/components/UI";
import { useAddUsersToGroupMutation } from "@/graphql/generated";

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
  } = useUsersSelection();
  const [addUsers] = useAddUsersToGroupMutation();

  const groupUsersIds = getGroupData.users.map((u) => u._id);

  const addMembersHandler = async () => {
    const membersIds = getSelectedMembersId();

    try {
      await addUsers({
        variables: {
          addUsersArgs: {
            chatId: getGroupData._id,
            newUsers: membersIds,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }

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
        >
          Add
        </Button>
      }
    />
  );
};

export default MembersModal;
