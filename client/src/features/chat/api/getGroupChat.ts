import { gql } from "@apollo/client";

export const GET_GROUP_CHAT = gql`
  query GetGroupChat($chatId: ObjectId!) {
    getGroupChat(chatId: $chatId) {
      _id
      users {
        _id
      }
      messages {
        _id
        sender {
          _id
          fullname
          profileImg {
            url
          }
        }
        text
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
