import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { requestSignin } from "./signin.repository";
import { useMutation } from "@tanstack/react-query";

/**
 *  로그인용 훅 함수
 */
const useSigninHook = () => {
  const { login } = useAuth();
  const [result, setResult] = useState<string | null>(null);
  const [errorString, setErrorString] = useState<string | null>(null);
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
      if (response.result?.success == true) {
        const { accessToken, refreshToken, data } = response.result;
        login(accessToken, refreshToken, data.username);
        setResult("successful");
        setError(null);
        setErrorString;
        null;
      } else {
        setResult(null);
        setError(Math.random().toString());
        setErrorString(response?.message || "Signin failed");
      }
    },
    onError: (error: Error) => {
      setResult(null);
      setError(Math.random().toString());
      setErrorString(error.message);
    },
  });

  const signin = (username: string, password: string) => {
    return mutateAsync({ username, password });
  };
  return { result, isPending, signin, error, errorString };
};
export default useSigninHook;
