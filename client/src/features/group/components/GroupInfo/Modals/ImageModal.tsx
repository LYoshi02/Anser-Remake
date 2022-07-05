import { ImageUploader } from "@/components/ImageUploader";
import { Modal } from "@/components/UI";
import { useGroupContext } from "@/features/group/stores/GroupContext";
import {
  useDeleteGroupImageMutation,
  useSetGroupImageMutation,
} from "@/graphql/generated";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ImageModal = (props: Props) => {
  const {
    data: { getGroupData },
  } = useGroupContext();
  const [setGroupImage] = useSetGroupImageMutation();
  const [deleteGroupImage] = useDeleteGroupImageMutation();

  const uploadImageHandler = async (image: Blob) => {
    try {
      await setGroupImage({
        variables: {
          chatId: getGroupData._id,
          file: image,
        },
      });
      props.onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteImageHandler = async () => {
    try {
      await deleteGroupImage({
        variables: {
          chatId: getGroupData._id,
        },
      });
      props.onClose();
    } catch (error) {
      console.log(error);
    }
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
          currentImage={getGroupData.group?.image?.url}
        />
      }
      modalBodyProps={{ overflow: "auto", py: "4" }}
    />
  );
};

export default ImageModal;
