import { gql } from "@apollo/client";

export const GET_FULL_USER = gql`
  query GetFullUser($username: String!) {
    getUser(username: $username) {
      _id
      username
      fullname
      description
    }
  }
`;
