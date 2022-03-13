import { useGroupContext } from "../../../stores/GroupContext";
import { ImageUploader } from "@/components/ImageUploader";
import { Modal } from "@/components/UI";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ImageModal = (props: Props) => {
  const { dispatch } = useGroupContext();

  const uploadImageHandler = (image: Blob) => {
    dispatch({ type: "UPLOAD_IMAGE", payload: { image } });
    props.onClose();
  };

  const deleteImageHandler = () => {
    dispatch({ type: "DELETE_IMAGE" });
    props.onClose();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      modalProps={{ isCentered: true }}
      title="Group Image"
      body={
        <ImageUploader
          onUpload={uploadImageHandler}
          onDelete={deleteImageHandler}
        />
      }
      modalBodyProps={{ overflow: "auto", py: "4" }}
    />
  );
};

export default ImageModal;
