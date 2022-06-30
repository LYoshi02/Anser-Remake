import { Badge, Box, Flex, MenuItem } from "@chakra-ui/react";

import { Link, ListItem, Menu } from "@/components/UI";
import { useGroupContext } from "../../../stores/GroupContext";

type Props = {
  user: {
    _id: string;
    username: string;
    fullname: string;
    profileImg?: {
      url: string;
    } | null;
  };
  isAdmin: boolean;
};

const Member = ({ user, isAdmin }: Props) => {
  const {
    data: { getGroupData },
    authUserId,
  } = useGroupContext();
  const isMemberAdmin = getGroupData.group!.admins.some(
    (admin) => admin._id === user._id
  );
  const isAuthUser = user._id === authUserId;

  const removeAdminHandler = (userId: string) => {
    console.log(userId);
  };

  const addAdminHandler = (userId: string) => {
    console.log(userId);
  };

  const removeMemberHandler = (userId: string) => {
    console.log(userId);
  };

  let adminMenu = null;
  if (!isAuthUser && isAdmin) {
    const adminMenuItem = isMemberAdmin ? (
      <MenuItem onClick={removeAdminHandler.bind(this, user._id)}>
        Remove as Admin
      </MenuItem>
    ) : (
      <MenuItem onClick={addAdminHandler.bind(this, user._id)}>
        Make Admin
      </MenuItem>
    );

    adminMenu = (
      <Box ml="2">
        <Menu menuColor="gray">
          {adminMenuItem}
          <MenuItem onClick={removeMemberHandler.bind(this, user._id)}>
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
    <Link href={isAuthUser ? `/profile` : `/users/${user.username}`}>
      <ListItem
        avatar={{ name: user.fullname }}
        title={user.fullname}
        description={`@${user.username}`}
        detail={
          <Flex align="center">
            {adminBadge}
            {adminMenu}
          </Flex>
        }
      />
    </Link>
  );
};

export default Member;
