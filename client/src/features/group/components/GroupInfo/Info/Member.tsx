import { Badge, Box, Flex, MenuItem } from "@chakra-ui/react";

import { Link, ListItem, Menu } from "@/components/UI";
import { useGroupContext } from "../../../stores/GroupContext";
import {
  useAppointAdminMutation,
  useRemoveAdminMutation,
  useRemoveFromGroupMutation,
} from "@/graphql/generated";
import { useRouter } from "next/router";

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
  const [apointAdmin] = useAppointAdminMutation();
  const [removeAdmin] = useRemoveAdminMutation();
  const [removeFromGroup] = useRemoveFromGroupMutation();

  const isMemberAdmin = getGroupData.group!.admins.some(
    (admin) => admin._id === user._id
  );
  const isAuthUser = user._id === authUserId;

  const removeAdminHandler = async (userId: string) => {
    try {
      await removeAdmin({
        variables: {
          removeAdminArgs: {
            chatId: getGroupData._id,
            userId,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addAdminHandler = async (userId: string) => {
    try {
      await apointAdmin({
        variables: {
          appointAdminArgs: {
            chatId: getGroupData._id,
            userId,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeMemberHandler = async (userId: string) => {
    try {
      await removeFromGroup({
        variables: {
          removeFromGroupArgs: {
            chatId: getGroupData._id,
            userId,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  let adminMenu = null;
  if (!isAuthUser && isAdmin) {
    const adminMenuItem = isMemberAdmin ? (
      <MenuItem onClick={removeAdminHandler.bind(this, user._id)}>
        Remove as Admin
      </MenuItem>
    ) : (
      <MenuItem onClick={addAdminHandler.bind(this, user._id)}>
        Appoint as Admin
      </MenuItem>
    );

    adminMenu = (
      <Box
        ml="2"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
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
    <Link href={isAuthUser ? "/profile" : `/users/${user.username}`}>
      <ListItem
        avatar={{ name: user.fullname, src: user.profileImg?.url }}
        title={user.fullname}
        description={`@${user.username}`}
        clicked={() => {
          console.log("clicked");
        }}
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
