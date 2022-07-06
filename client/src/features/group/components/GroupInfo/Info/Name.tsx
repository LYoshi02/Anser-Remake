import {
  Editable,
  EditableInput,
  EditablePreview,
  Text,
  Box,
} from "@chakra-ui/react";

import EditNameControls from "./EditNameControls";
import { useGroupContext } from "../../../stores/GroupContext";
import { useChangeGroupNameMutation } from "@/graphql/generated";
import { useToast } from "@/hooks/useToast";

const Name = () => {
  const {
    data: { getGroupData },
  } = useGroupContext();
  const [changeGroupName] = useChangeGroupNameMutation();
  const toast = useToast();

  const groupName = getGroupData.group!.name;

  const updateGroupNameHandler = async (newName: string) => {
    const trimmedName = newName.trim();

    if (trimmedName.length === 0 || newName === groupName) return;

    try {
      const res = await changeGroupName({
        variables: {
          changeGroupNameArgs: {
            chatId: getGroupData._id,
            newName: trimmedName,
          },
        },
      });

      if (res.data) {
        toast({
          title: "Success",
          description: "Name updated successfully",
          status: "success",
        });
      }
    } catch (e) {}
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
