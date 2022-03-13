import * as yup from "yup";
import { loginFormSchema, signupFormSchema } from "../utils/formSchemas";

export interface LoginFormValues
  extends yup.InferType<typeof loginFormSchema> {}

export interface SignupFormValues
  extends yup.InferType<typeof signupFormSchema> {}
