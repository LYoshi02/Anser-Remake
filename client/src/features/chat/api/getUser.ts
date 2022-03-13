import { gql, useQuery } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      _id
      username
      fullname
      description
    }
  }
`;

type Response = {
  getUser: {
    _id: string;
    username: string;
    fullname: string;
    description: string | null;
  };
};

type Input = {
  username: string;
};

type Args = {
  variables: Input;
};

export const useGetUser = ({ variables }: Args) => {
  return useQuery<Response, Input>(GET_USER, {
    variables: { username: variables.username },
  });
};
