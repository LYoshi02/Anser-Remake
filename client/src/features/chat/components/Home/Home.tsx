import { useState } from "react";
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";

import Navigation from "./Navigation/Navigation";
import ChatsList from "./ChatsList/ChatsList";
import UsersList from "./UsersList/UsersList";

const Home = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      <Navigation />
      <Tabs
        variant="line"
        colorScheme="yellow"
        isFitted
        index={tabIndex}
        onChange={(i) => setTabIndex(i)}
        isLazy
      >
        <TabList>
          <Tab>Chats</Tab>
          <Tab>Users</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <ChatsList />
          </TabPanel>
          <TabPanel p="0">
            <UsersList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Home;
