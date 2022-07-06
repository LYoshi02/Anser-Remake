import { ReactNode, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import {
  GetGroupDataQuery,
  useGetGroupDataLazyQuery,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Alert, Spinner } from "@/components/UI";

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
  const [getData, { data: groupData, loading: reqLoading }] =
    useGetGroupDataLazyQuery();
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
        } catch (e) {}
      };

      getGroupData();
    }
  }, [chatId, getData]);

  if (reqLoading || !authUser) {
    return <Spinner text="Loading group..." />;
  } else if (!groupData) {
    return <Alert alertProps={{ status: "error" }} title="Group not found" />;
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
