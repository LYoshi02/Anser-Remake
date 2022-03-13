import { ReactElement } from "react";
import {
  FormControl as ChakraFormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

type Props = {
  id: string;
  input: ReactElement;
  label?: string;
  error?: string;
};

const FormControl = (props: Props) => {
  return (
    <ChakraFormControl id={props.id} isInvalid={Boolean(props.error)}>
      {props.label && <FormLabel>{props.label}</FormLabel>}
      {props.input}
      {props.error && <FormErrorMessage>{props.error}</FormErrorMessage>}
    </ChakraFormControl>
  );
};

export default FormControl;
