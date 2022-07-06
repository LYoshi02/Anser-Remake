import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@chakra-ui/react";

import {
  Container,
  FormBody,
  FormFooter,
  FormHeading,
  PasswordInput,
  signupFormSchema,
  SignupFormValues,
} from "@/features/auth";
import { FormControl } from "@/components/UI";
import { useCreateUserMutation } from "@/graphql/generated";

const SignupPage: NextPage = () => {
  const [signupUser, { loading: reqLoading }] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupFormSchema),
  });

  const submitHandler = async (values: SignupFormValues) => {
    try {
      await signupUser({
        variables: {
          user: {
            email: values.email,
            password: values.password,
            username: values.username,
            fullname: values.fullname,
          },
        },
      });
    } catch (e) {}
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(submitHandler)}>
        <FormHeading>Sign Up</FormHeading>
        <FormBody>
          <FormControl
            id="email"
            label="Email"
            input={
              <Input
                type="text"
                placeholder="user@email.com"
                {...register("email")}
              />
            }
            error={errors.email?.message}
          />

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
            id="username"
            label="User Name"
            input={
              <Input
                type="text"
                placeholder="your_user_name"
                {...register("username")}
              />
            }
            error={errors.username?.message}
          />

          <FormControl
            id="password"
            label="Password"
            input={
              <PasswordInput
                placeholder="At least 8 characters"
                hookForm={register("password")}
              />
            }
            error={errors.password?.message}
          />
        </FormBody>

        <FormFooter
          btnText="Sign up"
          secondaryAction={{
            text: "Already have an account?",
            linkText: "Log in now!",
            linkUrl: "/login",
          }}
          isLoading={reqLoading}
        />
      </form>
    </Container>
  );
};

export default SignupPage;
