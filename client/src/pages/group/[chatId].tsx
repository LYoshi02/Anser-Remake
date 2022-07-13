import type { NextPage } from "next";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container } from "@/components/UI";
import { GroupInfo, GroupProvider } from "@/features/group";
import { useAuthUser } from "@/hooks/useAuthUser";

const GroupInfoPage: NextPage = () => {
  const {} = useAuthUser({ redirectTo: "/login" });

  return (
    <AppLayout>
      <BackNav isBackIconRequired />
      <Container>
        <GroupProvider>
          <GroupInfo />
        </GroupProvider>
      </Container>
    </AppLayout>
  );
};

export default GroupInfoPage;
