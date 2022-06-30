import { gql } from "@apollo/client";

export const LEAVE_GROUP = gql`
  mutation LeaveGroup($chatId: String!) {
    leaveGroup(chatId: $chatId) {
      _id
    }
  }
`;
