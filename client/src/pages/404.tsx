import { useRouter } from "next/router";

import { useAuthUser } from "@/hooks/useAuthUser";

const NotFoundPage = () => {
  const { authUser, loading } = useAuthUser();
  const router = useRouter();

  if (loading) return null;

  if (authUser) {
    router.replace("/chats");
  } else {
    router.replace("/login");
  }

  return null;
};

export default NotFoundPage;
