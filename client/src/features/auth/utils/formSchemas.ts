import * as yup from "yup";

export const loginFormSchema = yup.object({
  email: yup
    .string()
    .email("The email is not valid")
    .required("The email is required"),
  password: yup
    .string()
    .required("The password is required")
    .min(8, "The password must be at least 8 characters long"),
});

export const signupFormSchema = yup.object({
  email: yup
    .string()
    .required("The email is required")
    .email("The email is not valid"),
  fullname: yup
    .string()
    .trim()
    .required("The name is required")
    .min(3, "The name must be at least 3 characters long")
    .max(30, "The name must be at most 30 characters long"),
  username: yup
    .string()
    .trim()
    .required("The username is required")
    .min(3, "The username must be at least 3 characters long")
    .max(30, "The username must be at most 30 characters long")
    .matches(/^[\w](?!.*?\.{2})[\w.]{1,28}[\w]/, "The username is not valid"),
  password: yup
    .string()
    .required("The password is required")
    .min(8, "The password must be at least 8 characters long"),
});
