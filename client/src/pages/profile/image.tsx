import type { NextPage } from "next";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container } from "@/components/UI";
import { ImageUploader } from "@/components/ImageUploader";
import {
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
} from "@/graphql/generated";
import { useAuthUser } from "@/hooks/useAuthUser";

const ProfileImagePage: NextPage = () => {
  const user = useAuthUser({ redirectTo: "/login" });
  const router = useRouter();
  const [uploadProfileImage] = useUploadProfileImageMutation();
  const [deleteProfileImage] = useDeleteProfileImageMutation();

  const deleteImageHandler = async () => {
    try {
      await deleteProfileImage();
      router.replace("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImageHandler = async (image: Blob) => {
    try {
      await uploadProfileImage({ variables: { file: image } });
      router.replace("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <AppLayout>
      <BackNav />
      <Container>
        <ImageUploader
          onDelete={deleteImageHandler}
          onUpload={uploadImageHandler}
          currentImage={user.profileImg?.url}
        />
      </Container>
    </AppLayout>
  );
};

export default ProfileImagePage;
