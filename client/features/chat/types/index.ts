import * as yup from "yup";
import { createGroupFormSchema } from "../utils/formSchemas";

export interface CreateGroupFormValues
  extends yup.InferType<typeof createGroupFormSchema> {}
