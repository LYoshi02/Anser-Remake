import { useState } from "react";
import { Box, Button, Icon, useColorModeValue } from "@chakra-ui/react";
import { IoMdCheckbox } from "react-icons/io";

import SearchInput from "../Inputs/SearchInput";
import { User } from "../../types";
import { ListItem } from "@/components/UI";
import { useGetUsersQuery } from "@/graphql/generated";

type Props = {
  selectedUsers: User[];
  onUserSelected: (user: User) => void;
};

const FETCH_LIMIT = 20;

// TODO: improve loading and error messages
const UsersSelection = ({ selectedUsers, onUserSelected }: Props) => {
  const checkIconColor = useColorModeValue("yellow.500", "yellow.300");
  const ButtonColor = useColorModeValue("yellow.700", "yellow.500");
  const [lastSearch, setLastSearch] = useState("");
  const {
    data: usersData,
    loading,
    fetchMore,
    refetch,
  } = useGetUsersQuery({
    variables: {
      searchText: "",
      limit: FETCH_LIMIT,
      offset: 0,
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!usersData) {
    return <p>Users not found</p>;
  }

  const findSelectedUser = (userId: string) => {
    return selectedUsers.some((u) => u._id === userId);
  };

  const fetchMoreUsersHandler = async () => {
    console.log("Fetching more users: ", lastSearch);
    const res = await fetchMore({
      variables: {
        limit: FETCH_LIMIT,
        offset: usersData.getUsers.length,
        searchText: lastSearch,
      },
    });
    console.log(res);
  };

  const searchUserHandler = async (searchText: string) => {
    if (
      (lastSearch.length === 0 && searchText.length === 0) ||
      lastSearch === searchText
    ) {
      console.log("Invalid search");
      return;
    }

    setLastSearch(searchText);
    await refetch({
      limit: FETCH_LIMIT,
      offset: 0,
      searchText,
    });
  };

  return (
    <Box>
      <SearchInput onSearchUser={searchUserHandler} />
      {usersData.getUsers.map((user) => {
        const isSelected = findSelectedUser(user._id);

        return (
          <ListItem
            key={user._id}
            avatar={{ name: user.fullname }}
            title={user.fullname}
            description={`@${user.username}`}
            clicked={() => onUserSelected(user)}
            detail={
              isSelected ? (
                <Icon as={IoMdCheckbox} w="6" h="6" color={checkIconColor} />
              ) : undefined
            }
          />
        );
      })}
      <Box textAlign="center" mt="4" pb="4">
        <Button
          variant="ghost"
          color={ButtonColor}
          onClick={fetchMoreUsersHandler}
        >
          Load More Users
        </Button>
      </Box>
    </Box>
  );
};

export default UsersSelection;
