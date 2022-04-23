import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import {
  Box,
  Flex,
  Heading,
  Icon,
  MenuItem,
  MenuDivider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  HiUserCircle,
  HiLogout,
  HiUserGroup,
  HiSun,
  HiMoon,
} from "react-icons/hi";

import { Link, Menu } from "@/components/UI";

const ChatNavigation = () => {
  const router = useRouter();
  const client = useApolloClient();
  const { colorMode, toggleColorMode } = useColorMode();

  const colorRed = useColorModeValue("red.700", "red.400");
  const colorMainNavbar = useColorModeValue("purple.700", "");

  const onLogout = () => {
    localStorage.removeItem("token");
    client.clearStore();
    router.push("/");
  };

  return (
    <Flex
      bg={colorMainNavbar}
      p={{ base: "2", lg: "4" }}
      justify="space-between"
      align="center"
      h="14"
      minH="14"
    >
      <Heading as="h1" fontSize="lg" color="gray.200">
        <Link href="/chats">Anser</Link>
      </Heading>
      <Menu>
        <Box>
          <MenuItem
            icon={<Icon as={HiUserCircle} w="5" h="5" d="block" />}
            onClick={() => router.push("/profile")}
          >
            My Profile
          </MenuItem>
          <MenuItem
            icon={<Icon as={HiUserGroup} w="5" h="5" d="block" />}
            onClick={() => router.push("/group/new")}
          >
            New Group
          </MenuItem>
          <MenuItem
            icon={
              colorMode === "light" ? (
                <Icon as={HiMoon} w="5" h="5" d="block" />
              ) : (
                <Icon as={HiSun} w="5" h="5" d="block" />
              )
            }
            onClick={toggleColorMode}
          >
            {colorMode === "light" ? "Dark Theme" : "Light Theme"}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            color={colorRed}
            icon={<Icon as={HiLogout} w="5" h="5" d="block" />}
            onClick={onLogout}
          >
            Log Out
          </MenuItem>
        </Box>
      </Menu>
    </Flex>
  );
};

export default ChatNavigation;
