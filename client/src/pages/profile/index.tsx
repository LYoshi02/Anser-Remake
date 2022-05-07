import type { NextPage } from "next";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container } from "@/components/UI";
import { ProfilePreview, ProfileForm } from "@/features/user";
import { useAuthUser } from "@/hooks/useAuthUser";

const ProfilePage: NextPage = () => {
  const user = useAuthUser({ redirectTo: "/login" });

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <AppLayout>
      <BackNav />
      <Container>
        <ProfilePreview
          fullname={user.fullname}
          username={user.username}
          profileImageUrl={user.profileImg?.url}
        />
        <ProfileForm fullname={user.fullname} description={user.description} />
      </Container>
    </AppLayout>
  );
};

export default ProfilePage;
