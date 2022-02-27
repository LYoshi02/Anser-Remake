import {
  Box,
  Icon,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiMoon, HiSun } from "react-icons/hi";

const ThemeIcon = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const iconHoverColor = useColorModeValue("white", "yellow.400");

  return (
    <Box onClick={toggleColorMode}>
      <Tooltip
        label={colorMode === "light" ? "Dark Theme 🌑" : "Light Theme ☀️"}
        fontSize="md"
        placement="bottom-start"
        hasArrow
      >
        <Box as="span">
          <Icon
            as={colorMode === "light" ? HiMoon : HiSun}
            w="8"
            h="8"
            color="gray.200"
            _hover={{ color: iconHoverColor }}
            transition="ease-out"
            transitionDuration=".3s"
          />
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ThemeIcon;
