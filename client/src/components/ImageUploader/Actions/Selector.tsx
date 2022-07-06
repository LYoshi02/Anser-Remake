import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Flex,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

type Props = {
  currentImage: string | null;
  onSelectImage: (img: string) => void;
  onDeleteImage: () => void;
  isLoading?: boolean;
};

const ImageSelector = (props: Props) => {
  const toast = useToast();
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    multiple: false,
    maxSize: 5000000, // 5MB
    onDropAccepted: (acceptedImages) => {
      props.onSelectImage(URL.createObjectURL(acceptedImages[0]));
    },
    onDropRejected: () => {
      toast({
        title: "Error!",
        description:
          "Se produjo un error al seleccionar tu imagen, intenta de nuevo.",
        status: "error",
        isClosable: true,
      });
    },
  });

  const bgColor = useColorModeValue("gray.200", "gray.900");

  return (
    <Box>
      <Box {...getRootProps()}>
        <Flex
          h="96"
          w="100%"
          align="center"
          justify="center"
          bgColor={!props.currentImage ? bgColor : undefined}
          position="relative"
        >
          <input {...getInputProps()} name="image" />
          {props.currentImage ? (
            <Image
              src={props.currentImage}
              alt="Image"
              objectFit="cover"
              layout="fill"
            />
          ) : (
            "Your Image"
          )}
        </Flex>
        <Button
          colorScheme="yellow"
          isFullWidth
          mt="4"
          isLoading={props.isLoading}
        >
          Select Image
        </Button>
      </Box>
      {props.currentImage && (
        <Button
          colorScheme="red"
          variant="outline"
          isFullWidth
          mt="2"
          onClick={props.onDeleteImage}
          isLoading={props.isLoading}
        >
          Delete Image
        </Button>
      )}
    </Box>
  );
};

export default ImageSelector;
