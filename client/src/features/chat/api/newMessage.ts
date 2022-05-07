import { gql } from "@apollo/client";

export const NEW_MESSAGE = gql`
  subscription OnNewMessageAdded {
    newMessage {
      chatId
      message {
        text
        _id
        sender {
          _id
        }
      }
    }
  }
`;
