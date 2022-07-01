import { gql } from "@apollo/client";

export const APPOINT_ADMIN = gql`
  mutation AppointAdmin($appointAdminArgs: GroupOperationInput!) {
    appointAdmin(appointAdminArgs: $appointAdminArgs) {
      _id
    }
  }
`;
