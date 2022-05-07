import { gql } from "@apollo/client";

export const NEW_USER = gql`
  subscription OnNewUserAdded {
    newUser {
      _id
      fullname
      username
    }
  }
`;
