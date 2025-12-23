import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { requestSignin } from "./signinRepository";
import { useMutation } from "@tanstack/react-query";

/**
 *  로그인용 훅 함수
 */
const useSigninHook = () => {
  const { login } = useAuth();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => requestSignin(username, password),
    onSuccess: (response) => {
      if (response.success) {
        const { accessToken, refreshToken } = response.data;
        login(accessToken, refreshToken);
        setResult("Signin successful");
        setError(null);
      } else {
        setResult(null);
        setError("Signin failed");
      }
    },
    onError: (error: Error) => {
      setResult(null);
      setError(error.message);
    },
  });

  const signin = (username: string, password: string) => {
    return mutateAsync({ username, password });
  };
  return { result, isPending, signin, error };
};
export default useSigninHook;
