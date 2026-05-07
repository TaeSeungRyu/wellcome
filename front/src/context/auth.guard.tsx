import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "./auth.context";

export default function AuthGuard() {
  const auth: any = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    const unsub = router.subscribe("onResolved", (_) => {
      if (!auth.token) {
        router.navigate({
          to: "/login/signin",
        });
      }
    });
    return () => unsub();
  }, [router]);

  return null;
}
