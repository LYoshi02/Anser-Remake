import { gql } from "@apollo/client";

export const UPDATE_CHAT_LAST_SEEN = gql`
  mutation UpdateChatLastSeen($chatId: ObjectId!) {
    updateChatLastSeen(chatId: $chatId)
  }
`;
