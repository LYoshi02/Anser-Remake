import { gql } from "@apollo/client";

export const REMOVE_USER_FROM_GROUP = gql`
  mutation RemoveFromGroup($removeFromGroupArgs: GroupOperationInput!) {
    removeFromGroup(removeFromGroupArgs: $removeFromGroupArgs) {
      _id
    }
  }
`;
