import { gql } from "@apollo/client";

export const DELETE_PROFILE_IMAGE = gql`
  mutation DeleteProfileImage {
    deleteProfileImage {
      _id
      profileImg {
        _id
      }
    }
  }
`;
