import { gql } from "@apollo/client";

export const GET_AUTH_USER = gql`
  query GetAuthUser {
    getAuthUser {
      isAuth
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
    }
  }
`;
