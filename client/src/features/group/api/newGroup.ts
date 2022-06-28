import { gql } from "@apollo/client";

export const CREATE_NEW_GROUP = gql`
  mutation CreateNewGroup($groupData: NewGroupInput!) {
    createNewGroup(groupData: $groupData) {
      _id
    }
  }
`;
