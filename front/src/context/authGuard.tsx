import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "./authContext";

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
      //auth.token 값과 pathname에 따른 리다이렉트 처리 가능
      console.log("모든 이동 감지:", location.pathname);
    });
    return () => unsub();
  }, [router]);

  return null;
}
