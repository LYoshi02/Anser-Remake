import { ObjectId } from "mongodb";

export const generateUniqueValuesArr = (arr: any[]) => {
  return [...new Set(arr)];
};

export const generateChatUsersArr = (
  recipients: ObjectId[],
  authUserId: ObjectId
): ObjectId[] => {
  const chatUsers = generateUniqueValuesArr(recipients);
  const authUserExists = chatUsers.some((id) => authUserId === id);
  if (!authUserExists) {
    chatUsers.push(authUserId);
  }

  return chatUsers;
};
