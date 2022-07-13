import { useEffect } from "react";
import { useRouter } from "next/router";

import { useGetAuthUserQuery } from "@/graphql/generated";

// This params should only be set when using the hook on a page
type Params = {
  redirectTo: string;
  redirectIfFound?: boolean;
};

const defaultParams: Params = {
  redirectTo: "",
  redirectIfFound: false,
};

export const useAuthUser = ({
  redirectTo,
  redirectIfFound = false,
}: Params = defaultParams) => {
  const { data: userData, loading, error } = useGetAuthUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (!redirectTo || !userData) return;

    if (
      (redirectTo && !redirectIfFound && !userData.getAuthUser.isAuth) ||
      (redirectIfFound && userData.getAuthUser.isAuth)
    ) {
      router.replace(redirectTo);
    }
  }, [redirectIfFound, redirectTo, router, userData]);

  return {
    authUser: userData?.getAuthUser.user,
    loading,
    error,
  };
};
