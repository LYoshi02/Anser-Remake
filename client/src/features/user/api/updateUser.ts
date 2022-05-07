import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUser($fullname: String!, $description: String!) {
    updateUser(fullname: $fullname, description: $description) {
      _id
      fullname
      description
    }
  }
`;
