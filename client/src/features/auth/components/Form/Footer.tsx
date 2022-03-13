import { Button, Box, Text } from "@chakra-ui/react";

import { Link } from "@/components/UI";

type Props = {
  secondaryAction?: {
    text: string;
    linkText: string;
    linkUrl: string;
  };
  btnText: string;
  isLoading?: boolean;
};

const FormFooter = ({ secondaryAction, btnText, isLoading }: Props) => {
  return (
    <Box mt="8">
      {secondaryAction && (
        <Text fontSize="md" mb="3">
          {`${secondaryAction.text} `}
          <Link
            href={secondaryAction.linkUrl}
            linkProps={{ color: "yellow.600", fontWeight: "bold" }}
          >
            {secondaryAction.linkText}
          </Link>
        </Text>
      )}
      <Button
        variant="solid"
        colorScheme="purple"
        type="submit"
        isFullWidth
        isLoading={isLoading}
      >
        {btnText}
      </Button>
    </Box>
  );
};

export default FormFooter;
