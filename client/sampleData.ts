// TODO: delete after implementing the server and database
import { Chat, Group, User } from "@/types";

export const sampleUsers: User[] = [
  {
    id: "1",
    fullname: "Yoshi Debat",
    username: "yoshidebat",
  },
  {
    id: "2",
    fullname: "Alex King",
    username: "alexking",
    newUser: true,
  },
  {
    id: "3",
    fullname: "Paula Baker",
    username: "paula.baker",
  },
  {
    id: "4",
    fullname: "Aleena Hunt",
    username: "aleenahunt",
  },
  {
    id: "5",
    fullname: "Samir Greene",
    username: "samir_greene",
  },
];

export const mainSampleUser: User = {
  id: "1",
  fullname: "Yoshi Debat",
  username: "yoshidebat",
  description: "My personal description",
};

export const sampleUser2: User = {
  id: "2",
  fullname: "Alex King",
  username: "alexking",
};

export const sampleUser3: User = {
  id: "3",
  fullname: "Paula Baker",
  username: "paula.baker",
};

export const sampleUser4: User = {
  id: "4",
  fullname: "Aleena Hunt",
  username: "aleenahunt",
};

export const sampleUser5: User = {
  id: "5",
  fullname: "Samir Greene",
  username: "samir_greene",
};

export const sampleChats: Chat[] = [
  {
    id: "1",
    users: [mainSampleUser, sampleUser2],
    messages: [
      {
        id: "1",
        sender: mainSampleUser,
        text: "Hello!",
      },
    ],
    newMessage: true,
  },
  {
    id: "2",
    users: [mainSampleUser, sampleUser3],
    messages: [
      {
        id: "1",
        sender: sampleUser3,
        text: "Wep!",
      },
    ],
  },
  {
    id: "3",
    users: [mainSampleUser, sampleUser4, sampleUser5],
    messages: [
      {
        id: "1",
        sender: mainSampleUser,
        text: "This is a group",
      },
    ],
    group: {
      name: "The Best Group",
    },
  },
];

export const sampleGroup: Group = {
  users: [mainSampleUser, sampleUser4, sampleUser5],
  group: {
    name: "The Best Group",
    admins: [mainSampleUser],
  },
};

export const sampleChat: Chat = {
  id: "1",
  users: [mainSampleUser, sampleUser2],
  messages: [
    {
      id: "1",
      sender: mainSampleUser,
      text: "Hello!",
    },
    {
      id: "2",
      sender: sampleUser2,
      text: "Hi!",
    },
  ],
};
