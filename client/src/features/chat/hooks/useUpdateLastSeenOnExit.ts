import { useEffect } from "react";
import Router from "next/router";

import { useUpdateChatLastSeenMutation } from "@/graphql/generated";

export const useUpdateLastSeenOnExit = (chatId?: string) => {
  const [updateLastSeen] = useUpdateChatLastSeenMutation();

  useEffect(() => {
    const routeChangeStart = async (newUrl: any) => {
      if (Router.asPath !== newUrl && chatId) {
        await updateLastSeen({ variables: { chatId } });
      }
    };

    const beforeunload = () => {
      if (chatId) {
        updateLastSeen({ variables: { chatId } }).catch((e) => {});
      }
    };

    window.addEventListener("beforeunload", beforeunload);
    Router.events.on("routeChangeStart", routeChangeStart);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
      Router.events.off("routeChangeStart", routeChangeStart);
    };
  }, [chatId, updateLastSeen]);
};
