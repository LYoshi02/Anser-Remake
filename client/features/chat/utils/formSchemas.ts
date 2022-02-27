import * as yup from "yup";

export const createGroupFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("The name is required")
    .min(3, "The name must be at least 3 characters long")
    .max(30, "The name must be at most 30 characters long"),
});
