import type { NextPage } from "next";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container } from "@/components/UI";
import { ProfilePreview, ProfileForm } from "@/features/user";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Spinner } from "@/components/UI";

const ProfilePage: NextPage = () => {
  const { authUser } = useAuthUser({ redirectTo: "/login" });

  let content = <Spinner text="Loading profile..." />;
  if (authUser) {
    content = (
      <>
        <ProfilePreview
          fullname={authUser.fullname}
          username={authUser.username}
          profileImageUrl={authUser.profileImg?.url}
        />
        <ProfileForm
          fullname={authUser.fullname}
          description={authUser.description}
        />
      </>
    );
  }

  return (
    <AppLayout>
      <BackNav />
      <Container>{content}</Container>
    </AppLayout>
  );
};

export default ProfilePage;
