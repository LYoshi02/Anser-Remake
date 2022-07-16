import { ObjectId } from "mongodb";
import { UserLastSeen } from "../../schemas/chat";

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

export const getUpdatedLastSeenArr = (
  currentLastSeenArr: UserLastSeen[],
  userId: ObjectId
) => {
  const userLastSeenIndex = currentLastSeenArr.findIndex(
    (c) => c.user.toString() === userId.toString()
  );
  const updatedLastSeenArr = [...currentLastSeenArr];
  const updatedUserLastSeen = {
    user: userId,
    date: new Date(),
  };

  if (userLastSeenIndex >= 0) {
    updatedLastSeenArr.splice(userLastSeenIndex, 1, updatedUserLastSeen);
  } else {
    updatedLastSeenArr.push(updatedUserLastSeen);
  }

  return updatedLastSeenArr;
};
