import { ImageUploader } from "@/components/ImageUploader";
import { Modal } from "@/components/UI";
import { useGroupContext } from "@/features/group/stores/GroupContext";
import {
  useDeleteGroupImageMutation,
  useSetGroupImageMutation,
} from "@/graphql/generated";
import { useToast } from "@/hooks/useToast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ImageModal = (props: Props) => {
  const {
    data: { getGroupData },
  } = useGroupContext();
  const [setGroupImage, { loading: setImageReqLoading }] =
    useSetGroupImageMutation();
  const [deleteGroupImage, { loading: deleteImageReqLoading }] =
    useDeleteGroupImageMutation();
  const toast = useToast({ status: "success", title: "Success" });

  const uploadImageHandler = async (image: Blob) => {
    try {
      const res = await setGroupImage({
        variables: {
          chatId: getGroupData._id,
          file: image,
        },
      });

      if (res.data) {
        toast({ description: "Image uploaded successfully." });
      }

      props.onClose();
    } catch (e) {}
  };

  const deleteImageHandler = async () => {
    try {
      const res = await deleteGroupImage({
        variables: {
          chatId: getGroupData._id,
        },
      });

      if (res.data) {
        toast({ description: "Image deleted successfully." });
      }

      props.onClose();
    } catch (e) {}
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
          isReqLoading={setImageReqLoading || deleteImageReqLoading}
        />
      }
      modalBodyProps={{ overflow: "auto", py: "4" }}
    />
  );
};

export default ImageModal;
