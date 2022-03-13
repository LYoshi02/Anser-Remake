import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(newUser: $user) {
      _id
    }
  }
`;
