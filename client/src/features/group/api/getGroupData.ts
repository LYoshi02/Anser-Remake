import { gql } from "@apollo/client";

export const GET_GROUP_DATA = gql`
  query GetGroupData($chatId: String!) {
    getGroupData(chatId: $chatId) {
      _id
      users {
        _id
        fullname
        username
        profileImg {
          url
        }
      }
      group {
        name
        admins {
          _id
        }
        image {
          url
        }
      }
    }
  }
`;
