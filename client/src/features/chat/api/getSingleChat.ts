import { gql } from "@apollo/client";

export const GET_SINGLE_CHAT = gql`
  query GetSingleChat($recipientUsername: String!) {
    getSingleChat(recipientUsername: $recipientUsername) {
      chat {
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
      }
      recipient {
        _id
        fullname
        profileImg {
          url
        }
      }
    }
  }
`;
