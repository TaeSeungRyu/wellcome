import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "./auth.context";

export default function AuthGuard() {
  const auth: any = useContext(AuthContext);
  useEffect(() => {
    if (auth.token) {
      //console.log("auth:: ", auth.token);
    }
  }, [auth.token]);
  const router = useRouter();
  useEffect(() => {
    const unsub = router.subscribe("onResolved", (_) => {
      //console.log("모든 이동 감지:", location.pathname, auth.token);
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
