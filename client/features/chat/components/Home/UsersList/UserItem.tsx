import { Badge } from "@chakra-ui/react";

import { Link, ListItem } from "@/components/UI";
import { User } from "@/types";

type Props = {
  user: User;
};

const UserItem = ({ user }: Props) => {
  let newUserBadge;
  if (user.newUser) {
    newUserBadge = <Badge colorScheme="purple">New</Badge>;
  }

  return (
    <Link href={`/users/${user.username}`}>
      <ListItem
        avatar={{ name: user.fullname }}
        title={user.fullname}
        description={`@${user.username}`}
        detail={newUserBadge}
      />
    </Link>
  );
};

export default UserItem;
