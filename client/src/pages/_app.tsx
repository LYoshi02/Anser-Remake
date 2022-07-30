import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import { DefaultSeo, DefaultSeoProps } from "next-seo";

import { client } from "@/lib/apolloClient";
import theme from "@/styles/theme";
import { refreshTokenUrl, setAccessToken } from "@/helpers/accessToken";

const defaultSEOConfig: DefaultSeoProps = {
  titleTemplate: "%s | Anser",
  defaultTitle: "Anser",
  description:
    "Anser is a realtime chat messaging application made by Yoshi Debat",
  openGraph: {
    type: "website",
    site_name: "Anser Remake",
    title: "Anser",
    description:
      "Anser is a realtime chat messaging application made by Yoshi Debat",
    url: "https://anser.vercel.app/",
    images: [
      {
        url: "https://anser.vercel.app/images/site.png",
        width: 1280,
        height: 640,
        alt: "Anser Site Thumbnail",
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
  },
  additionalLinkTags: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
    {
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
  ],
  additionalMetaTags: [
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "theme-color", content: "#ffffff" },
  ],
};

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
