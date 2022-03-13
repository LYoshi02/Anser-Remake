import { Button } from "@chakra-ui/react";

import { useGroupContext } from "../../../stores/GroupContext";
import useUsersSelection from "../../../hooks/useUsersSelection";
import UsersSelection from "../../UsersSelection/UsersSelection";
import { Modal } from "@/components/UI";
import { sampleUsers } from "@/sampleData";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MembersModal = (props: Props) => {
  const {
    state: { members },
    dispatch,
  } = useGroupContext();
  const {
    selectedUsers: selectedMembers,
    onSelectUser: onSelectMember,
    getSelectedUsersId: getSelectedMembersId,
  } = useUsersSelection();

  const nonMembersUsers = sampleUsers.filter(
    (user) => !members.some((member) => member.id === user.id)
  );

  const addMembersHandler = () => {
    const membersId = getSelectedMembersId();
    dispatch({ type: "ADD_MEMBERS", payload: { usersId: membersId } });
    props.onClose();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      modalProps={{ isCentered: true }}
      modalBodyProps={{ overflow: "auto" }}
      title="Add New Members"
      body={
        <UsersSelection
          users={nonMembersUsers}
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
