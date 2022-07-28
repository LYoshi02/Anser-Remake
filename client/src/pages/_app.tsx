import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import { DefaultSeo } from "next-seo";

import { client } from "@/lib/apolloClient";
import theme from "@/styles/theme";
import { refreshTokenUrl, setAccessToken } from "@/helpers/accessToken";
import { defaultSEOConfig } from "@/helpers/seo";

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(refreshTokenUrl, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.accessToken);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo {...defaultSEOConfig} />
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default MyApp;
