import { gql } from "@apollo/client";

export const ADD_MESSAGE = gql`
  mutation AddMessage($chatData: AddMessageInput!) {
    addMessage(chatData: $chatData) {
      _id
    }
  }
`;
