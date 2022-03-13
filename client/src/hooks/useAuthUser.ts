import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";

const GET_AUTH_USER = gql`
  query GetAuthUser {
    getAuthUser {
      isAuth
      user {
        _id
        email
        username
        fullname
        description
      }
    }
  }
`;

type Response = {
  getAuthUser: {
    isAuth: boolean;
    user: {
      _id: string;
      email: string;
      username: string;
      fullname: string;
      description: string | null;
    };
  };
};

type Props = {
  redirectTo?: string;
  redirectIfFound?: boolean;
};

export const useAuthUser = ({
  redirectTo = "",
  redirectIfFound = false,
}: Props) => {
  const { data: userData } = useQuery<Response>(GET_AUTH_USER);
  const router = useRouter();

  useEffect(() => {
    if (!redirectTo || !userData) return;

    if (
      (redirectTo && !redirectIfFound && !userData.getAuthUser.isAuth) ||
      (redirectIfFound && userData.getAuthUser.isAuth)
    ) {
      router.push(redirectTo);
    }
  }, [redirectIfFound, redirectTo, router, userData]);

  return userData?.getAuthUser.user;
};
