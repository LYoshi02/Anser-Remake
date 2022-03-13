import { ReactNode } from "react";
import {
  IconButton,
  Icon,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";

type Props = {
  children: ReactNode;
  menuColor?: string;
};

const MenuComponent = ({ children, menuColor }: Props) => {
  const colorGray = useColorModeValue("gray.800", "gray.100");
  const colorMainMenu = useColorModeValue("purple.800", "");
  const colorMainMenuHover = useColorModeValue("purple.900", "");

  let menuStyles: MenuButtonProps = {
    color: "gray.200",
    bgColor: colorMainMenu,
    _hover: { bgColor: colorMainMenuHover },
    _active: { bgColor: colorMainMenuHover },
  };

  if (menuColor === "gray") {
    menuStyles = {
      color: colorGray,
    };
  }

  return (
    <Menu autoSelect={false}>
      <MenuButton
        as={IconButton}
        icon={<Icon as={HiDotsVertical} />}
        {...menuStyles}
      />
      <MenuList color={colorGray} shadow="md">
        {children}
      </MenuList>
    </Menu>
  );
};

export default MenuComponent;
