import { ReactNode } from "react";
import { Box, Button, useColorModeValue } from "@chakra-ui/react";

import SearchInput from "@/components/UI/Inputs/SearchInput";
import { Spinner } from "../UI";

type Props = {
  isLoading: boolean;
  userItems: ReactNode[];
  onSearchUser: (searchText: string) => void;
  onFetchMore: () => void;
};

const UsersSearch = ({
  userItems,
  onSearchUser,
  onFetchMore,
  isLoading,
}: Props) => {
  const ButtonColor = useColorModeValue("yellow.700", "yellow.500");

  if (isLoading) {
    return <Spinner text="Loading users..." />;
  }

  return (
    <Box>
      <Box px="1">
        <SearchInput
          onSearch={onSearchUser}
          inputProps={{ placeholder: "Search user" }}
        />
      </Box>
      {userItems}
      <Box textAlign="center" mt="4" pb="4">
        <Button variant="ghost" color={ButtonColor} onClick={onFetchMore}>
          Load More Users
        </Button>
      </Box>
    </Box>
  );
};

export default UsersSearch;
