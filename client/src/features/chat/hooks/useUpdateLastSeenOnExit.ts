import { useEffect } from "react";
import Router from "next/router";

import { useUpdateChatLastSeenMutation } from "@/graphql/generated";

export const useUpdateLastSeenOnExit = (chatId?: string) => {
  const [updateLastSeen] = useUpdateChatLastSeenMutation();

  useEffect(() => {
    const routeChangeStart = async (newUrl: any) => {
      if (Router.asPath !== newUrl && chatId) {
        console.log("Changing route", chatId, newUrl);
        await updateLastSeen({ variables: { chatId } });
      }
    };

    const beforeunload = () => {
      if (chatId) {
        console.log("Before unload");
        updateLastSeen({ variables: { chatId } }).catch((err) => {
          console.log(err);
        });
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
