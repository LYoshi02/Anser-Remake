import * as yup from "yup";

export const profileFormSchema = yup.object({
  fullname: yup
    .string()
    .trim()
    .required("The name is required")
    .min(3, "The name must be at least 3 characters long")
    .max(30, "The name must be at most 30 characters long"),
  description: yup
    .string()
    .trim()
    .default("")
    .max(200, "The description must be at most 200 characters long"),
});
