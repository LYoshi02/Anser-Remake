import { useState } from "react";
import { Area } from "react-easy-crop/types";

import ImageCropper from "./Actions/Cropper";
import ImageSelector from "./Actions/Selector";
import { getCroppedImg } from "@/utils/cropImage";
import { useToast } from "@/hooks/useToast";

type Props = {
  currentImage?: string;
  onUpload: (img: Blob) => void;
  onDelete: () => void;
  onUploadError?: (err: any) => void;
  isReqLoading?: boolean;
};

const ImageUploader = (props: Props) => {
  const toast = useToast();
  const [image, setImage] = useState<string>(
    props.currentImage ? props.currentImage : ""
  );
  const [isCropping, setIsCropping] = useState(false);

  const selectImageHandler = (img: string) => {
    console.log(img);
    setImage(img);
    setIsCropping(true);
  };

  const uploadImageHandler = async (croppedArea: Area) => {
    if (!image) return;

    try {
      const croppedImageBlob = await getCroppedImg(image!, croppedArea);
      props.onUpload(croppedImageBlob);
    } catch (error: any) {
      if (props.onUploadError) {
        props.onUploadError(error);
      } else {
        toast({
          title: "Error!",
          description: "We couldn't generate your image. Try again later.",
          status: "error",
        });
      }
    }
  };

  let imageComponent = (
    <ImageSelector
      currentImage={image}
      onSelectImage={selectImageHandler}
      onDeleteImage={props.onDelete}
      isLoading={props.isReqLoading}
    />
  );
  if (image && isCropping) {
    imageComponent = (
      <ImageCropper
        onUploadImage={uploadImageHandler}
        image={image}
        isLoading={props.isReqLoading}
      />
    );
  }

  return imageComponent;
};

export default ImageUploader;
