import { gql } from "@apollo/client";

export const NEW_CHAT = gql`
  subscription OnNewChatAdded {
    newChat {
      _id
      users {
        _id
        username
        fullname
        profileImg {
          url
        }
      }
      messages {
        _id
        text
        sender {
          _id
        }
      }
      group {
        name
        image {
          url
        }
      }
    }
  }
`;

// For chat list
// subscription OnNewChatAdded {
//     newChat {
//       _id
//       users {
//         _id
//         username
//         fullname
//       }
//       messages {
//         _id
//         text
//       }
//     }
//   }
