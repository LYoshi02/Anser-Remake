import { Box, IconButton } from "@chakra-ui/react";
import { HiArrowRight } from "react-icons/hi";

type Props = {
  clicked?: () => void;
};

const CreateGroupBtn = (props: Props) => {
  return (
    <Box
      position="fixed"
      bottom={{ base: "0", "2xl": "8" }}
      right={{ base: "0", "2xl": "calc((100vw - 1400px)/2)" }}
      mr="6"
      mb="4"
    >
      <IconButton
        aria-label="Create Group"
        colorScheme="purple"
        onClick={props.clicked}
        fontSize="25px"
        icon={<HiArrowRight />}
        rounded="full"
        size="lg"
      />
    </Box>
  );
};

export default CreateGroupBtn;
