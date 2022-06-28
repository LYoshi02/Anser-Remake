import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers($searchText: String!, $offset: Int!, $limit: Int!) {
    getUsers(searchText: $searchText, offset: $offset, limit: $limit) {
      _id
      username
      fullname
    }
  }
`;
