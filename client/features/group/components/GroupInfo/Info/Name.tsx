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
    state: { name },
    dispatch,
  } = useGroupContext();

  return (
    <Box mt="4">
      <Text mb="1" fontWeight="bold" fontSize="lg">
        Group Name
      </Text>
      <Editable
        defaultValue={name}
        isPreviewFocusable={false}
        submitOnBlur={false}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onSubmit={(value) =>
          dispatch({ type: "UPDATE_NAME", payload: { newName: value } })
        }
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
