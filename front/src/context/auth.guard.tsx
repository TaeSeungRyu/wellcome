import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "./auth.context";

export function AuthGuard() {
  const { token } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const unsub = router.subscribe("onResolved", () => {
      if (!token) {
        router.navigate({
          to: "/login/signin",
        });
      }
    });
    return () => unsub();
  }, [router, token]);

  return null;
}
