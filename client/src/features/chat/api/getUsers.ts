import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers($searchOptions: GetUsersInput!) {
    getUsers(searchOptions: $searchOptions) {
      _id
      username
      fullname
      profileImg {
        url
      }
    }
  }
`;
