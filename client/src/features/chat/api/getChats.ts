import { gql } from "@apollo/client";

export const GET_CHATS = gql`
  query GetChats {
    getChats {
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
