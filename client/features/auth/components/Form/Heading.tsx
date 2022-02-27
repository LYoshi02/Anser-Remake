import { ReactNode } from "react";
import { Heading } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
};

const FormHeading = (props: Props) => {
  return (
    <Heading as="h2" size="xl" mb="6" textAlign="center">
      {props.children}
    </Heading>
  );
};

export default FormHeading;
