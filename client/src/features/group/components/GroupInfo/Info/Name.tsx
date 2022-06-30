import {
  Editable,
  EditableInput,
  EditablePreview,
  Text,
  Box,
} from "@chakra-ui/react";

import EditNameControls from "./EditNameControls";
import { useGroupContext } from "../../../stores/GroupContext";

const Name = () => {
  const {
    data: { getGroupData },
  } = useGroupContext();

  const groupName = getGroupData.group!.name;

  const updateGroupNameHandler = (newName: string) => {
    console.log(newName);
  };

  return (
    <Box mt="4">
      <Text mb="1" fontWeight="bold" fontSize="lg">
        Group Name
      </Text>
      <Editable
        defaultValue={groupName}
        isPreviewFocusable={false}
        submitOnBlur={false}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onSubmit={updateGroupNameHandler}
      >
        {(props) => (
          <>
            <EditablePreview />
            <EditableInput />
            <EditNameControls {...props} />
          </>
        )}
      </Editable>
    </Box>
  );
};

export default Name;
