import { gql } from "@apollo/client";

export const NEW_USER_SUBSCRIPTION = gql`
  subscription OnNewUserAdded {
    newUser {
      _id
      fullname
      username
    }
  }
`;
