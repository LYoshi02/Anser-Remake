import { gql } from "@apollo/client";

export const GET_GROUP_CHAT = gql`
  query GetGroupChat($chatId: String!) {
    getGroupChat(chatId: $chatId) {
      _id
      users {
        _id
        fullname
        profileImg {
          url
        }
      }
      messages {
        _id
        sender {
          _id
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
