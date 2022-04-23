import { gql } from "@apollo/client";

export const NEW_MESSAGE_SUBSCRIPTION = gql`
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

// For chat list
// subscription OnNewMessageAdded {
//   newMessage {
//     chatId
//     message {
//       text
//       _id
//     }
//   }
// }
