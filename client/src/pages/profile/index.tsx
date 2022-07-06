import type { NextPage } from "next";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container } from "@/components/UI";
import { ProfilePreview, ProfileForm } from "@/features/user";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Spinner } from "@/components/UI";

const ProfilePage: NextPage = () => {
  const user = useAuthUser({ redirectTo: "/login" });

  let content = <Spinner text="Loading profile..." />;
  if (user) {
    content = (
      <>
        <ProfilePreview
          fullname={user.fullname}
          username={user.username}
          profileImageUrl={user.profileImg?.url}
        />
        <ProfileForm fullname={user.fullname} description={user.description} />
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
