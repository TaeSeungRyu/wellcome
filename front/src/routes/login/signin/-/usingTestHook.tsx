import { requestTest } from "./signinRepository";
import { useQuery } from "@tanstack/react-query";

/**
 *  테스트 훅 함수
 */
const queryKey = ["useTestHook"];
const useTestHook = () => {
  const {
    data: result,
    refetch: testTodo,
    isPending,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      return await requestTest();
    },
    enabled: false,
    select(data) {
      return data?.data ?? null;
    },
  });

  return { result, isPending, testTodo, error };
};
export default useTestHook;
