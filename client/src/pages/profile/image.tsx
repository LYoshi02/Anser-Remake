import type { NextPage } from "next";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container, Spinner } from "@/components/UI";
import { ImageUploader } from "@/components/ImageUploader";
import {
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useToast } from "@/hooks/useToast";

const ProfileImagePage: NextPage = () => {
  const user = useAuthUser({ redirectTo: "/login" });
  const toast = useToast({ status: "success", title: "Success" });
  const router = useRouter();
  const [uploadProfileImage, { loading: uploadReqLoading }] =
    useUploadProfileImageMutation();
  const [deleteProfileImage, { loading: deleteReqLoading }] =
    useDeleteProfileImageMutation();

  const deleteImageHandler = async () => {
    try {
      const res = await deleteProfileImage();

      if (res.data) {
        toast({ description: "Image deleted successfully." });
        router.replace("/profile");
      }
    } catch (e) {}
  };

  const uploadImageHandler = async (image: Blob) => {
    try {
      const res = await uploadProfileImage({ variables: { file: image } });

      if (res.data) {
        toast({ description: "Image uploaded successfully." });
        router.replace("/profile");
      }
    } catch (e) {}
  };

  let content = <Spinner text="Loading profile..." />;
  if (user) {
    content = (
      <ImageUploader
        onDelete={deleteImageHandler}
        onUpload={uploadImageHandler}
        currentImage={user.profileImg?.url}
        isReqLoading={uploadReqLoading || deleteReqLoading}
      />
    );
  }

  return (
    <AppLayout>
      <BackNav />
      <Container>{content}</Container>
    </AppLayout>
  );
};

export default ProfileImagePage;
