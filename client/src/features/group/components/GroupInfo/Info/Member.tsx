import { Badge, Box, Flex, MenuItem } from "@chakra-ui/react";

import { ListItem, Menu } from "@/components/UI";
import { User } from "@/types";
import { useGroupContext } from "../../../stores/GroupContext";

type Props = {
  user: User;
};

const Member = ({ user }: Props) => {
  const {
    state: { admins, isAdmin },
    dispatch,
  } = useGroupContext();
  const isMemberAdmin = admins.some((admin) => admin.id === user.id);
  const isYourUser = user.id === "1";

  let adminMenu = null;
  if (!isYourUser && isAdmin) {
    const adminMenuItem = isMemberAdmin ? (
      <MenuItem
        onClick={() =>
          dispatch({ type: "REMOVE_ADMIN", payload: { userId: user.id } })
        }
      >
        Remove as Admin
      </MenuItem>
    ) : (
      <MenuItem
        onClick={() =>
          dispatch({ type: "ADD_ADMIN", payload: { userId: user.id } })
        }
      >
        Make Admin
      </MenuItem>
    );

    adminMenu = (
      <Box ml="2">
        <Menu menuColor="gray">
          {adminMenuItem}
          <MenuItem
            onClick={() =>
              dispatch({ type: "REMOVE_MEMBER", payload: { userId: user.id } })
            }
          >
            Remove From the Group
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  let adminBadge;
  if (isMemberAdmin) {
    adminBadge = (
      <Badge colorScheme="purple" variant="subtle">
        Admin
      </Badge>
    );
  }

  return (
    <ListItem
      avatar={{ name: user.fullname }}
      title={user.fullname}
      description={user.username}
      detail={
        <Flex align="center">
          {adminBadge}
          {adminMenu}
        </Flex>
      }
    />
  );
};

export default Member;
