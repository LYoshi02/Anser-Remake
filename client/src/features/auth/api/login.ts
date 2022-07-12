import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        _id
        email
        username
        fullname
        description
        profileImg {
          url
        }
      }
      token
    }
  }
`;
