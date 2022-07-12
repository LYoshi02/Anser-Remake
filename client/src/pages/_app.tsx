import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";

import { client } from "@/lib/apolloClient";
import theme from "@/styles/theme";
import { useEffect, useState } from "react";
import { setAccessToken } from "@/helpers/accessToken";

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);

  // TODO: check this
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/refresh-token", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAccessToken(data.accessToken);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default MyApp;
