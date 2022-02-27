import { Divider, Flex, useDisclosure } from "@chakra-ui/react";

import GroupImage from "./Info/GroupImage";
import Members from "./Info/Members";
import Name from "./Info/Name";
import ImageModal from "./Modals/ImageModal";
import MembersModal from "./Modals/MembersModal";

const Info = () => {
  const {
    isOpen: isImageModalOpen,
    onOpen: onOpenImageModal,
    onClose: onCloseImageModal,
  } = useDisclosure();
  const {
    isOpen: isMembersModalOpen,
    onOpen: onOpenMembersModal,
    onClose: onCloseMembersModal,
  } = useDisclosure();

  return (
    <>
      <Flex direction="column">
        <GroupImage onOpenModal={onOpenImageModal} />
        <Name />
      </Flex>
      <Divider my="4" />
      <Members onOpenModal={onOpenMembersModal} />
      <MembersModal isOpen={isMembersModalOpen} onClose={onCloseMembersModal} />
      <ImageModal isOpen={isImageModalOpen} onClose={onCloseImageModal} />
    </>
  );
};

export default Info;
