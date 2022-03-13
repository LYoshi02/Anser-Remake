import { useForm } from "react-hook-form";
import { Button, Input, Stack, Textarea } from "@chakra-ui/react";

import { profileFormSchema } from "../utils/formSchemas";
import { ProfileFormValues } from "../types";
import { FormControl } from "@/components/UI";
import { yupResolver } from "@hookform/resolvers/yup";
import { mainSampleUser } from "@/sampleData";

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileFormSchema),
    defaultValues: {
      fullname: mainSampleUser.fullname,
      description: mainSampleUser.description,
    },
  });

  const submitHandler = (values: ProfileFormValues) => {
    console.log(values);
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
              {...register("fullname")}
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
              {...register("description")}
            />
          }
          error={errors.description?.message}
        />

        <Button type="submit" colorScheme="yellow">
          Guardar
        </Button>
      </Stack>
    </form>
  );
};

export default ProfileForm;
