import { MouseEvent, ReactElement } from "react";
import {
  Avatar,
  AvatarProps,
  Box,
  Flex,
  Text,
  TextProps,
  useColorModeValue,
} from "@chakra-ui/react";

type Props = {
  avatar: AvatarProps;
  description: string;
  descriptionProps?: TextProps;
  title: string;
  detail?: ReactElement;
  clicked?: (e: MouseEvent) => void;
};

const ListItem = ({
  avatar,
  description,
  descriptionProps,
  title,
  detail,
  clicked,
}: Props) => {
  const userHoverColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      align="center"
      px={{ base: "2", lg: "4" }}
      py="4"
      _hover={{ bgColor: userHoverColor }}
      transition="ease-out"
      transitionDuration=".3s"
      cursor="pointer"
      onClick={clicked}
    >
      <Avatar mr="4" {...avatar} />
      <Flex align="center" justify="space-between" w="full">
        <Box>
          <Text fontWeight="bold" fontSize="xl">
            {title}
          </Text>
          <Text fontSize="md" {...descriptionProps}>
            {description}
          </Text>
        </Box>
        {detail}
      </Flex>
    </Flex>
  );
};

export default ListItem;
