import { gql } from "@apollo/client";

export const GET_CHAT = gql`
  query GetChat($recipientUsername: String!) {
    getChat(recipientUsername: $recipientUsername) {
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
    }
  }
`;
