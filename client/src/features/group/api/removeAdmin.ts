import { gql } from "@apollo/client";

export const REMOVE_ADMIN = gql`
  mutation RemoveAdmin($removeAdminArgs: GroupOperationInput!) {
    removeAdmin(removeAdminArgs: $removeAdminArgs) {
      _id
    }
  }
`;
