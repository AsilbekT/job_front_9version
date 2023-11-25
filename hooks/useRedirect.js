import { useRouter } from "next/router";
import { useEffect } from "react";

export const useRedirect = (route) => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace(route);
  }, [router]);
};