import { useAuth } from "@/context/auth.context";
import { requestSignin } from "./signin.repository";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

/**
 *  로그인용 훅 함수
 */
const useSigninHook = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => requestSignin(username, password),
    onSuccess: (response) => {
      if (response.result?.success == true) {
        const { accessToken, refreshToken, data } = response.result;
        const decoded: Record<string, any> = jwtDecode(accessToken);
        login(accessToken, refreshToken, data.username, decoded.role);
      }
    },
  });
};
export default useSigninHook;
