import type { NextPage } from "next";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container } from "@/components/UI";
import { ProfilePreview, ProfileForm } from "@/features/user";
import { mainSampleUser } from "@/sampleData";

const ProfilePage: NextPage = () => {
  return (
    <AppLayout>
      <BackNav />
      <Container>
        <ProfilePreview
          fullname={mainSampleUser.fullname}
          username={mainSampleUser.username}
        />
        <ProfileForm />
      </Container>
    </AppLayout>
  );
};

export default ProfilePage;
