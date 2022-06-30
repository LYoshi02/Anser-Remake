import { ObjectId } from "mongodb";

export const generateChatUsersArr = (
  recipients: ObjectId[],
  authUserId: ObjectId
): ObjectId[] => {
  const chatUsers = [...new Set(recipients)];
  const authUserExists = chatUsers.some((id) => authUserId === id);
  if (!authUserExists) {
    chatUsers.push(authUserId);
  }

  return chatUsers;
};
