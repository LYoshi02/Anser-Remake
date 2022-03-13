import {
  Modal as ChakraModal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  ModalCloseButton,
  ModalBodyProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  modalProps?: any;
  body?: ReactNode;
  modalBodyProps?: ModalBodyProps;
  footer?: ReactNode;
};

const Modal = (props: Props) => {
  return (
    <ChakraModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      {...props.modalProps}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        {props.body && (
          <ModalBody {...props.modalBodyProps}>{props.body}</ModalBody>
        )}
        {props.footer && <ModalFooter>{props.footer}</ModalFooter>}
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
