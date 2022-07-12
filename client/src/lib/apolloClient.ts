import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  split,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { createUploadLink } from "apollo-upload-client";
import { createStandaloneToast } from "@chakra-ui/react";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import Router from "next/router";

import theme from "@/styles/theme";
import { getAccessToken, setAccessToken } from "@/helpers/accessToken";

const toastId = "error-toast";
const toast = createStandaloneToast({
  theme,
  defaultOptions: {
    title: "Error!",
    status: "error",
    duration: 8000,
    isClosable: true,
    variant: "solid",
    position: "bottom",
  },
});

const showErrorMessage = (msg: string) => {
  if (!toast.isActive(toastId)) {
    toast({
      id: toastId,
      description: msg,
    });
  }
};

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();

    if (!token) {
      return true;
    }

    try {
      // TODO: change the <any> generic
      const { exp } = jwtDecode<any>(token);
      const isTokenValid = Date.now() < exp * 1000;

      return isTokenValid;
    } catch {
      return false;
    }
  },
  fetchAccessToken: () => {
    return fetch("http://localhost:4000/refresh-token", {
      method: "POST",
      credentials: "include",
    });
  },
  handleFetch: (newAccessToken) => {
    setAccessToken(newAccessToken);
  },
  handleError: (err) => {
    Router.replace("/login");
    showErrorMessage("Invalid session, try to relogin");
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach((err) => {
      console.log(
        `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
      );

      if (err.extensions.code === "UNAUTHENTICATED") {
        Router.replace("/login");
      }

      showErrorMessage(err.message);
    });
  if (networkError) {
    toast({
      description: "Network error",
    });
  }
});

// Using this link to set the token into the context
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((operation) => {
          const token = getAccessToken();
          if (token) {
            operation.setContext({
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URL,
  credentials: "include",
});

let wsLink: GraphQLWsLink,
  splitLink: ApolloLink = uploadLink;
if (typeof window !== "undefined") {
  wsLink = new GraphQLWsLink(
    createClient({
      url: "ws://localhost:4000/graphql",
      connectionParams: () => {
        const token = getAccessToken();
        return {
          authToken: `Bearer ${token}`,
        };
      },
    })
  );

  splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    uploadLink
  );
}

export const client = new ApolloClient({
  link: ApolloLink.from([tokenRefreshLink, errorLink, requestLink, splitLink]),
  credentials: "include",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAuthUser: {
            keyArgs: ["user"],
          },
          // Necessary to use pagination
          getUsers: {
            keyArgs: ["searchOptions", ["searchText", "excludedUsers"]],
            merge(existing, incoming, { args }) {
              console.log(existing, incoming, args);
              const merged = existing ? existing.slice(0) : [];

              if (incoming) {
                if (args && args.searchOptions) {
                  // Assume an offset of 0 if args.offset omitted.
                  const { offset = 0 } = args.searchOptions;
                  for (let i = 0; i < incoming.length; ++i) {
                    merged[offset + i] = incoming[i];
                  }
                } else {
                  // It's unusual (probably a mistake) for a paginated field not
                  // to receive any arguments, so you might prefer to throw an
                  // exception here, instead of recovering by appending incoming
                  // onto the existing array.
                  merged.push.apply(merged, incoming);
                }
              }

              return merged;
            },
          },
        },
      },
      Chat: {
        fields: {
          users: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          group: {
            merge(existing, incoming, { mergeObjects }) {
              return mergeObjects(existing, incoming);
            },
          },
        },
      },
    },
  }),
});
