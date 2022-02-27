import { Stack } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const FormBody = (props: Props) => {
  return <Stack spacing="4">{props.children}</Stack>;
};

export default FormBody;
