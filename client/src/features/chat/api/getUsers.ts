import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      _id
      username
      fullname
    }
  }
`;
