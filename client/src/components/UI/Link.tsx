import { ReactNode } from "react";
import NextLink from "next/link";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
  href: string;
  linkProps?: LinkProps;
};

const Link = (props: Props) => {
  const linkStyles: LinkProps = {
    _hover: {},
    ...props.linkProps,
  };

  return (
    <NextLink href={props.href} passHref>
      <ChakraLink {...linkStyles}>{props.children}</ChakraLink>
    </NextLink>
  );
};

export default Link;
