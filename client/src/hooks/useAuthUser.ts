import { useEffect } from "react";
import { useRouter } from "next/router";

import { useGetAuthUserQuery } from "@/graphql/generated";

type Params = {
  redirectTo?: string;
  redirectIfFound?: boolean;
};

export const useAuthUser = ({
  redirectTo = "",
  redirectIfFound = false,
}: Params) => {
  const { data: userData, loading, error } = useGetAuthUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (!redirectTo || !userData) return;

    if (
      (redirectTo && !redirectIfFound && !userData?.getAuthUser.isAuth) ||
      (redirectIfFound && userData?.getAuthUser.isAuth)
    ) {
      router.push(redirectTo);
    }
  }, [redirectIfFound, redirectTo, router, userData]);

  return userData?.getAuthUser.user;
};
