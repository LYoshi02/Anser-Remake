import { gql } from "@apollo/client";

export const DELETE_GROUP_IMAGE = gql`
  mutation DeleteGroupImage($chatId: ObjectId!) {
    deleteGroupImage(chatId: $chatId) {
      _id
    }
  }
`;
