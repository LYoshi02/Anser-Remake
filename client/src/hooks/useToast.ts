import { useToast as useChakraToast, UseToastOptions } from "@chakra-ui/react";

export const useToast = (options?: UseToastOptions) => {
  const toast = useChakraToast({
    duration: 8000,
    variant: "solid",
    isClosable: true,
    position: "bottom",
    ...options,
  });

  return toast;
};
