import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

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
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/router";
import { useAuthUser } from "@/hooks/useAuthUser";

const SignupPage: NextPage = () => {
  const {} = useAuthUser({ redirectTo: "/chats", redirectIfFound: true });
  const [signupUser, { loading: reqLoading }] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupFormSchema),
  });
  const router = useRouter();
  const toast = useToast();

  const submitHandler = async (values: SignupFormValues) => {
    try {
      const res = await signupUser({
        variables: {
          user: {
            email: values.email,
            password: values.password,
            username: values.username,
            fullname: values.fullname,
          },
        },
      });

      if (res.data) {
        toast({
          status: "success",
          title: "Success",
          description: "User signed up successfully",
          duration: 3000,
        });
        router.push("/login");
      }
    } catch (e) {}
  };

  return (
    <>
      <NextSeo title="Sign Up" />
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
                  placeholder="your_username"
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
    </>
  );
};

export default SignupPage;
