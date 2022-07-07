import { useEffect, useState } from "react";

import {
  OnNewUserAddedDocument,
  OnNewUserAddedSubscription,
  useGetUsersQuery,
} from "@/graphql/generated";

type Params = {
  excludedUsers?: string[];
  fetchLimit?: number;
};

export const useGetUsers = ({ excludedUsers, fetchLimit = 20 }: Params) => {
  const {
    data: usersData,
    loading,
    subscribeToMore,
    refetch,
    fetchMore,
  } = useGetUsersQuery({
    variables: {
      searchOptions: {
        limit: fetchLimit,
        offset: 0,
        searchText: "",
        excludedUsers,
      },
    },
  });
  const [lastSearch, setLastSearch] = useState("");

  console.log(usersData);

  useEffect(() => {
    subscribeToMore<OnNewUserAddedSubscription>({
      document: OnNewUserAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newUser = subscriptionData.data.newUser;

        return Object.assign({}, prev, {
          getUsers: [newUser, ...prev.getUsers],
        });
      },
    });
  }, [subscribeToMore]);

  const fetchMoreUsersHandler = async () => {
    if (!usersData) return;

    console.log("Fetching more users: ", lastSearch);

    try {
      await fetchMore({
        variables: {
          searchOptions: {
            searchText: lastSearch,
            limit: fetchLimit,
            offset: usersData.getUsers.length,
            excludedUsers,
          },
        },
      });
    } catch (e) {}
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

    try {
      await refetch({
        searchOptions: {
          searchText,
          limit: fetchLimit,
          offset: 0,
          excludedUsers,
        },
      });
    } catch (e) {}
  };

  return {
    users: usersData,
    reqLoading: loading,
    onSearchUser: searchUserHandler,
    onFetchMoreUsers: fetchMoreUsersHandler,
  };
};
