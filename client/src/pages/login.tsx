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
import { useLoginUserLazyQuery } from "@/graphql/generated";
import { useToast } from "@/hooks/useToast";

const LoginPage: NextPage = () => {
  const [loginUser, { loading, error }] = useLoginUserLazyQuery();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginFormSchema),
  });
  const router = useRouter();

  const submitHandler = async (values: LoginFormValues) => {
    try {
      const res = await loginUser({
        variables: { email: values.email, password: values.password },
      });

      if (res.data && res.data.loginUser.token) {
        toast({
          status: "success",
          title: "Success",
          description: "User logged in successfully",
          duration: 3000,
        });
      } else {
        const errorMessage = "Couldn't generate an authentication token";
        toast({
          status: "error",
          title: "Error!",
          description: errorMessage,
        });
        throw new Error(errorMessage);
      }

      localStorage.setItem("token", res.data.loginUser.token);
      router.push("/chats");
    } catch (e) {}
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
                placeholder="user@email.com"
                type="text"
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
          isLoading={loading}
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
