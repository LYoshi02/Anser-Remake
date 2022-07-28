import {
  Alert as ChakraAlert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
} from "@chakra-ui/react";

type Props = {
  alertProps?: AlertProps;
  title?: string;
  description?: string;
};

const Alert = ({ alertProps, title, description }: Props) => {
  return (
    <ChakraAlert {...alertProps}>
      <AlertIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </ChakraAlert>
  );
};

export default Alert;
