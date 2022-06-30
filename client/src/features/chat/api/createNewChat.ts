import { gql } from "@apollo/client";

export const CREATE_NEW_CHAT = gql`
  mutation CreateNewChat($chatData: NewChatInput!) {
    createNewChat(chatData: $chatData) {
      _id
    }
  }
`;
