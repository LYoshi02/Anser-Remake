import { ReactNode } from "react";
import { Container as ChakraContainer, ContainerProps } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
  styleProps?: ContainerProps;
};

const Container = (props: Props) => {
  return (
    <ChakraContainer my="10" flexGrow="1" {...props.styleProps}>
      {props.children}
    </ChakraContainer>
  );
};

export default Container;
