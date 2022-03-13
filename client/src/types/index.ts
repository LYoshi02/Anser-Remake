export type User = {
  id: string;
  fullname: string;
  username: string;
  description?: string;
  newUser?: boolean;
};

export type Chat = {
  id: string;
  users: User[];
  messages: {
    id: string;
    sender: User;
    text: string;
  }[];
  group?: {
    name: string;
  };
  newMessage?: boolean;
};

export type Group = {
  users: User[];
  group: {
    name: string;
    admins: User[];
  };
};
