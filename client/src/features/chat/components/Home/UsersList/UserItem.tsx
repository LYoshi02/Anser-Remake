import { Badge } from "@chakra-ui/react";

import { Link, ListItem } from "@/components/UI";

type Props = {
  username: string;
  fullname: string;
  isNewUser?: boolean;
};

const UserItem = ({ username, fullname, isNewUser }: Props) => {
  let newUserBadge;
  if (isNewUser) {
    newUserBadge = <Badge colorScheme="purple">New</Badge>;
  }

  return (
    <Link href={`/users/${username}`}>
      <ListItem
        avatar={{ name: fullname }}
        title={fullname}
        description={`@${username}`}
        detail={newUserBadge}
      />
    </Link>
  );
};

export default UserItem;
