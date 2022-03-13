import type { NextPage } from "next";

import { AppLayout } from "@/components/Layout";
import { BackNav, Container } from "@/components/UI";
import { GroupInfo, GroupProvider } from "@/features/group";

const GroupInfoPage: NextPage = () => {
  return (
    <GroupProvider>
      <AppLayout>
        <BackNav isBackIconRequired />
        <Container>
          <GroupInfo />
        </Container>
      </AppLayout>
    </GroupProvider>
  );
};

export default GroupInfoPage;
