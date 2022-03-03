import type { NextPage } from "next";
import { useMutation } from "@apollo/client";
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
  CREATE_USER,
} from "@/features/auth";
import { FormControl } from "@/components/UI";

const SignupPage: NextPage = () => {
  const [] = useMutation(CREATE_USER);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupFormSchema),
  });

  const submitHandler = (values: SignupFormValues) => {
    console.log(values);
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
          btnText="Crear Cuenta"
          secondaryAction={{
            text: "Already have an account?",
            linkText: "Log in now!",
            linkUrl: "/login",
          }}
        />
      </form>
    </Container>
  );
};

export default SignupPage;
