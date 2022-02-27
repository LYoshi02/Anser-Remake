import * as yup from "yup";
import { profileFormSchema } from "../utils/formSchemas";

export interface ProfileFormValues
  extends yup.InferType<typeof profileFormSchema> {}
