import { Box, MenuItem, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Menu } from "@/components/UI";

type Props = {
  chatId: string;
  onLeaveGroup: () => void;
};

const GroupMenu = (props: Props) => {
  const router = useRouter();

  const colorRed = useColorModeValue("red.700", "red.400");

  return (
    <Box mr="2">
      <Menu>
        <Box>
          <MenuItem onClick={() => router.push(`/group/${props.chatId}`)}>
            Group Info
          </MenuItem>
          <MenuItem onClick={props.onLeaveGroup} color={colorRed}>
            Leave Group
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );
};

export default GroupMenu;
