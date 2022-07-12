import { Badge } from "@chakra-ui/react";

import { Link, ListItem } from "@/components/UI";

type Props = {
  username: string;
  fullname: string;
  imageUrl?: string;
  isNewUser?: boolean | null;
};

const UserItem = ({ username, fullname, imageUrl, isNewUser }: Props) => {
  let newUserBadge;
  if (isNewUser) {
    newUserBadge = <Badge colorScheme="purple">New</Badge>;
  }

  return (
    <Link href={`/users/${username}`}>
      <ListItem
        avatar={{ name: fullname, src: imageUrl }}
        title={fullname}
        description={`@${username}`}
        detail={newUserBadge}
      />
    </Link>
  );
};

export default UserItem;
