import { useForm } from "react-hook-form";
import { Button, Input, Stack, Textarea } from "@chakra-ui/react";

import { profileFormSchema } from "../utils/formSchemas";
import { ProfileFormValues } from "../types";
import { FormControl } from "@/components/UI";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateUserMutation } from "@/graphql/generated";

type Props = {
  fullname: string;
  description: string;
};

const ProfileForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    resetField,
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileFormSchema),
    defaultValues: {
      fullname: props.fullname,
      description: props.description,
    },
  });
  const [updateUser, { loading }] = useUpdateUserMutation();

  const submitHandler = async (values: ProfileFormValues) => {
    try {
      const res = await updateUser({
        variables: {
          fullname: values.fullname,
          description: values.description,
        },
      });

      if (res.data) {
        resetField("fullname", { defaultValue: res.data.updateUser.fullname });
        resetField("description", {
          defaultValue: res.data.updateUser.description,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Stack mt="8" spacing="4">
        <FormControl
          id="fullname"
          label="Full Name"
          input={
            <Input
              type="text"
              placeholder="Your Name"
              {...register("fullname", {
                setValueAs: (v) => v.trim(),
              })}
            />
          }
          error={errors.fullname?.message}
        />

        <FormControl
          id="description"
          label="Description"
          input={
            <Textarea
              placeholder="Your Description"
              rows={4}
              {...register("description", {
                setValueAs: (v) => v.trim(),
              })}
            />
          }
          error={errors.description?.message}
        />

        <Button
          type="submit"
          colorScheme="yellow"
          disabled={!isDirty}
          isLoading={loading}
        >
          Save
        </Button>
      </Stack>
    </form>
  );
};

export default ProfileForm;
