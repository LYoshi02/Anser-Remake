import { ReactNode, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import {
  GetGroupDataQuery,
  useGetGroupDataLazyQuery,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";

type GroupProviderProps = { children: ReactNode };

type ContextValue = {
  data: GetGroupDataQuery;
  authUserId: string;
};

const GroupContext = createContext<ContextValue | undefined>(undefined);

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroupContext must be used within a GroupProvider");
  }
  return context;
};

export const GroupProvider = (props: GroupProviderProps) => {
  const [getData, { data: groupData, loading }] = useGetGroupDataLazyQuery();
  const authUser = useAuthUser({ redirectTo: "/login" });
  const router = useRouter();

  const chatId = router.query.chatId as string;

  useEffect(() => {
    if (chatId) {
      const getGroupData = async () => {
        try {
          await getData({
            variables: { chatId },
          });
        } catch (error) {
          console.log(error);
        }
      };

      getGroupData();
    }
  }, [chatId, getData]);

  if (loading || !authUser) {
    return <p>Loading...</p>;
  }

  if (!groupData) {
    return <p>Group not found</p>;
  }

  const contextValue: ContextValue = {
    data: groupData,
    authUserId: authUser._id,
  };

  return (
    <GroupContext.Provider value={contextValue}>
      {props.children}
    </GroupContext.Provider>
  );
};
