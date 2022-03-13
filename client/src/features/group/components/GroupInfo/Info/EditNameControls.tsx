import { Icon, IconButton } from "@chakra-ui/react";
import { HiPencilAlt, HiCheck } from "react-icons/hi";

type Props = {
  isEditing: boolean;
  onSubmit: () => void;
  onEdit: () => void;
  onCancel: () => void;
};

const EditNameControls = ({ isEditing, onSubmit, onEdit }: Props) => {
  return isEditing ? (
    <IconButton
      aria-label="Confirm Name"
      icon={<Icon as={HiCheck} w={4} h={4} />}
      onClick={onSubmit}
      ml="2"
    />
  ) : (
    <IconButton
      aria-label="Edit Name"
      icon={<Icon as={HiPencilAlt} w={4} h={4} />}
      onClick={onEdit}
      ml="2"
    />
  );
};

export default EditNameControls;
