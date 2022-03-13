import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { createBreakpoints, mode } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "90em",
});

const colorConfig: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      "html, body, #__next": {
        height: "100%",
      },
      "::-webkit-scrollbar": {
        width: ".6em",
        height: "100%",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: mode("gray.300", "gray.500")(props),
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: mode("gray.100", "gray.300")(props),
      },
    }),
  },
  config: colorConfig,
  breakpoints,
});

export default theme;
