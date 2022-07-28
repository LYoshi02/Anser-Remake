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
  const [keepFetching, setKeepFetching] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const {
    data: usersData,
    loading: reqLoading,
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
    onCompleted: (data) => {
      if (fetchLimit > 0) {
        setKeepFetching(data.getUsers.length >= fetchLimit);
      }
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore<OnNewUserAddedSubscription>({
      document: OnNewUserAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newUser = subscriptionData.data.newUser;

        return Object.assign({}, prev, {
          getUsers: [newUser, ...prev.getUsers],
        });
      },
    });

    if (lastSearch.length > 0) {
      unsubscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, lastSearch]);

  const fetchMoreUsersHandler = async () => {
    if (!usersData || !keepFetching) return;

    try {
      setIsFetchingMore(true);
      const res = await fetchMore({
        variables: {
          searchOptions: {
            searchText: lastSearch,
            limit: fetchLimit,
            offset: usersData.getUsers.length,
            excludedUsers,
          },
        },
      });

      if (res.data) {
        setKeepFetching(res.data.getUsers.length >= fetchLimit);
      }
    } catch (e) {
      setKeepFetching(false);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const searchUserHandler = async (searchText: string) => {
    if (lastSearch === searchText) return;

    setLastSearch(searchText);
    setIsSearching(true);

    try {
      await refetch({
        searchOptions: {
          searchText,
          limit: fetchLimit,
          offset: 0,
          excludedUsers,
        },
      });
    } catch (e) {
    } finally {
      setIsSearching(false);
    }
  };

  return {
    users: usersData,
    keepFetching,
    isFetchingMore,
    reqLoading: reqLoading || isSearching,
    onSearchUser: searchUserHandler,
    onFetchMoreUsers: fetchMoreUsersHandler,
  };
};
