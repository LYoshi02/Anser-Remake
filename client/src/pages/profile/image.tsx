import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container } from "@/components/UI";
import { ImageUploader } from "@/components/ImageUploader";

const ProfileImagePage: NextPage = () => {
  const toast = useToast();
  const router = useRouter();

  const deleteImageHandler = () => {
    toast({
      title: "Image Deleted",
      description: "Your image was deleted successfully.",
      status: "success",
      isClosable: true,
    });
  };

  const uploadImageHandler = async (image: Blob) => {
    const formData = new FormData();
    formData.append("image", image);
    router.replace("/profile");
  };

  return (
    <AppLayout>
      <BackNav />
      <Container>
        <ImageUploader
          onDelete={deleteImageHandler}
          onUpload={uploadImageHandler}
        />
      </Container>
    </AppLayout>
  );
};

export default ProfileImagePage;
