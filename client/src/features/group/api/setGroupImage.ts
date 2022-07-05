import { gql } from "@apollo/client";

export const SET_GROUP_IMAGE = gql`
  mutation SetGroupImage($file: Upload!, $chatId: ObjectId!) {
    setGroupImage(file: $file, chatId: $chatId) {
      _id
    }
  }
`;
