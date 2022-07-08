import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  useColorModeValue,
} from "@chakra-ui/react";

type Props = {
  itemsNumber: number;
};

const ListSkeleton = ({ itemsNumber }: Props) => {
  const userHoverColor = useColorModeValue("gray.100", "gray.700");

  if (itemsNumber <= 0) return null;

  const skeletonItems = [];
  for (let i = 0; i < itemsNumber; i++) {
    skeletonItems.push(
      <Flex
        key={i}
        align="center"
        px={{ base: "2", lg: "4" }}
        py="4"
        _hover={{ bgColor: userHoverColor }}
        transition="ease-out"
        transitionDuration=".3s"
      >
        <SkeletonCircle size="14" />
        <Box flex="1" ml="4">
          <SkeletonText
            noOfLines={1}
            width={{ base: "30%", sm: "20%", lg: "35%" }}
          />
          <SkeletonText noOfLines={1} mt="2" />
        </Box>
      </Flex>
    );
  }

  return <>{skeletonItems}</>;
};

export default ListSkeleton;
