import { DefaultSeoProps } from "next-seo";

export const defaultSEOConfig: DefaultSeoProps = {
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
        width: 1920,
        height: 1080,
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
      href: "/favicon/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon/favicon-16x16.png",
    },
    { rel: "manifest", href: "/favicon/site.webmanifest" },
    {
      rel: "mask-icon",
      href: "/favicon/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
  ],
  additionalMetaTags: [
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "theme-color", content: "#ffffff" },
  ],
};
