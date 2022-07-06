import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { createUploadLink } from "apollo-upload-client";
import { createStandaloneToast } from "@chakra-ui/react";

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
          getUsers: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});
