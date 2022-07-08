import { ReactNode } from "react";
import { Box, Button, Text, useColorModeValue } from "@chakra-ui/react";

import { Spinner, SearchInput } from "../UI";

type Props = {
  isLoading: boolean;
  isFetchingMore: boolean;
  userItems: ReactNode[];
  keepFetching: boolean;
  onSearchUser: (searchText: string) => void;
  onFetchMore: () => void;
};

const UsersSearch = ({
  isLoading,
  isFetchingMore,
  userItems,
  keepFetching,
  onSearchUser,
  onFetchMore,
}: Props) => {
  const ButtonColor = useColorModeValue("yellow.700", "yellow.500");

  let loadMoreButton;
  if (keepFetching && !isLoading) {
    loadMoreButton = (
      <Box textAlign="center" mt="4" pb="4">
        <Button
          variant="ghost"
          color={ButtonColor}
          onClick={onFetchMore}
          isLoading={isFetchingMore}
        >
          Load More Users
        </Button>
      </Box>
    );
  }

  let usersElement: ReactNode = userItems;
  if (isLoading) {
    usersElement = <Spinner text="Loading users..." />;
  } else if (userItems.length === 0) {
    usersElement = (
      <Text fontSize="lg" textAlign="center" p="2">
        User not found
      </Text>
    );
  }

  return (
    <Box>
      <Box px="1">
        <SearchInput
          onSearch={onSearchUser}
          inputProps={{ placeholder: "Search user" }}
        />
      </Box>
      {usersElement}
      {loadMoreButton}
    </Box>
  );
};

export default UsersSearch;
