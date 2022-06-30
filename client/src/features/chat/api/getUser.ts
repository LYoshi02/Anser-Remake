import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      _id
      fullname
      profileImg {
        url
      }
    }
  }
`;
