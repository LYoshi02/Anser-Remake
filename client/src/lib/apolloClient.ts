import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { createUploadLink } from "apollo-upload-client";
import { createStandaloneToast } from "@chakra-ui/react";

import { offsetLimitPagination } from "@apollo/client/utilities";

import theme from "@/styles/theme";

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

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach((err) => {
      console.log(
        `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
      );

      if (err.extensions.code === "UNAUTHENTICATED") {
        // TODO: implement logic to handle this case
        console.log("Err: User not authenticated");
      }

      toast({
        description: err.message,
      });
    });
  if (networkError) {
    toast({
      description: "Network error",
    });
  }
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "ws://localhost:4000/graphql",
          connectionParams: () => ({
            authToken: localStorage.getItem("token"),
          }),
        })
      )
    : null;

const splitLink =
  typeof window !== "undefined"
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);

          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink!,
        errorLink.concat(authLink.concat(uploadLink))
      )
    : uploadLink;

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
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
