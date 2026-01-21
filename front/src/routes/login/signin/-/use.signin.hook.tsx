import { useAuth } from "@/context/auth.context";
import { requestSignin } from "./signin.repository";
import { useMutation } from "@tanstack/react-query";

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
        login(accessToken, refreshToken, data.username);
      }
    },
  });
};
export default useSigninHook;
