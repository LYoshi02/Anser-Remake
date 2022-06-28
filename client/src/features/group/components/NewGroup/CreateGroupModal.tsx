import { Box, Button, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormControl, Modal } from "@/components/UI";
import { CreateGroupFormValues, createGroupFormSchema } from "@/features/chat";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string) => void;
};

const CreateGroupModal = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormValues>({
    resolver: yupResolver(createGroupFormSchema),
  });

  const submitHandler = (values: CreateGroupFormValues) => {
    props.onCreateGroup(values.name);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      modalProps={{ isCentered: true }}
      title="Group Info"
      body={
        <form onSubmit={handleSubmit(submitHandler)}>
          <FormControl
            id="name"
            label="Name"
            input={
              <Input
                type="text"
                placeholder="Group Name"
                {...register("name")}
              />
            }
            error={errors.name?.message}
          />
          <Box py="4" textAlign="right">
            <Button colorScheme="purple" type="submit">
              Create Group
            </Button>
          </Box>
        </form>
      }
    />
  );
};

export default CreateGroupModal;
