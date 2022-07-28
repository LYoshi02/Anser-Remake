import { ReactNode, useEffect, useState } from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import { setAccessToken } from "@/helpers/accessToken";
import Home from "../../features/chat/components/Home/Home";

type Props = {
  children: ReactNode;
  keepChatsVisible?: boolean;
};

const AppLayout = ({ children, keepChatsVisible }: Props) => {
  const [loading, setLoading] = useState(true);
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/refresh-token", {
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

  return (
    <>
      <NextSeo noindex={true} />
      <Box
        height="100%"
        maxH="100%"
        bgColor="purple.900"
        py={{ base: "0", "2xl": "8" }}
      >
        <Flex
          height="100%"
          maxH="100%"
          maxW={{ base: "100%", "2xl": "1400px" }}
          overflow="hidden"
          bgColor={bgColor}
          borderRadius="sm"
          margin="0 auto"
          shadow="lg"
        >
          <Box
            borderRight={{ base: "none", lg: "1px solid" }}
            borderColor={{ base: "none", lg: borderColor }}
            overflow="auto"
            width={{ base: "100%", lg: "35%", xl: "30%" }}
            minWidth={{ lg: "35%", xl: "30%" }}
            d={keepChatsVisible ? "block" : { base: "none", lg: "block" }}
          >
            <Home />
          </Box>

          <Flex
            grow={1}
            overflow="auto"
            d={keepChatsVisible ? { base: "none", lg: "flex" } : "flex"}
            h="full"
            maxH="full"
            direction="column"
          >
            {children}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default AppLayout;
