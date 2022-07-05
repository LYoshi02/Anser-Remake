import { gql } from "@apollo/client";

export const REMOVE_USER_FROM_GROUP = gql`
  mutation ChangeGroupName($changeGroupNameArgs: ChangeGroupNameArgs!) {
    changeGroupName(changeGroupNameArgs: $changeGroupNameArgs) {
      _id
    }
  }
`;
