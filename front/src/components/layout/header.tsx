import { AuthContext } from "@/context/auth.context";
import { useContext, useEffect } from "react";

export default function HeaderComponent() {
  const auth: any = useContext(AuthContext);

  useEffect(() => {
    if (auth.token) {
      //console.log("auth:: ", auth.token);
    }
  }, [auth.token]);

  return <div className="header">header</div>;
}
