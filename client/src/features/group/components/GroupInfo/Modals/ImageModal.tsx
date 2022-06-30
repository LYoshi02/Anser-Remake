import { ImageUploader } from "@/components/ImageUploader";
import { Modal } from "@/components/UI";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ImageModal = (props: Props) => {
  const uploadImageHandler = (image: Blob) => {
    console.log("Uploading image...");
    props.onClose();
  };

  const deleteImageHandler = () => {
    console.log("Deleting image...");
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
