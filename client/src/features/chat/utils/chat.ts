import { ApolloClient, Reference, StoreObject } from "@apollo/client";

export const clearUnreadMessages = (
  client: ApolloClient<any>,
  chatObj: StoreObject | Reference
) => {
  return client.cache.modify({
    id: client.cache.identify(chatObj),
    fields: {
      unreadMessages() {
        return 0;
      },
    },
  });
};
