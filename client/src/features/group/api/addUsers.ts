import { gql } from "@apollo/client";

export const ADD_USERS_TO_GROUP = gql`
  mutation AddUsersToGroup($addUsersArgs: AddUsersToGroupInput!) {
    addUsersToGroup(addUsersArgs: $addUsersArgs) {
      _id
    }
  }
`;
