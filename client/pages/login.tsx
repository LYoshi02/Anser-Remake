import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@chakra-ui/react";

import {
  Container,
  FormBody,
  FormFooter,
  FormHeading,
  loginFormSchema,
  LoginFormValues,
  PasswordInput,
} from "@/features/auth";
import { FormControl } from "@/components/UI";

const LoginPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginFormSchema),
  });
  const router = useRouter();

  const submitHandler = (values: LoginFormValues) => {
    console.log(values);
    router.push("/chats");
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(submitHandler)}>
        <FormHeading>Log In</FormHeading>
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
          btnText="Log In"
          secondaryAction={{
            text: "Don't have an account?",
            linkText: "Sign up now!",
            linkUrl: "/signup",
          }}
        />
      </form>
    </Container>
  );
};

export default LoginPage;
