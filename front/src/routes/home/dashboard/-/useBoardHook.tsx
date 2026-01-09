import { useQuery } from "@tanstack/react-query";
import { requestBoardList } from "./boardRepository";

const queryKey = ["useBoardListHook"];
const boardListFetch = (page: number, limit: number) => {
  const {
    data: result,
    refetch: search,
    isPending,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      return await requestBoardList(page, limit);
    },
    enabled: false,
    select(data) {
      return data?.result ?? null;
    },
  });
  return { result, isPending, search, error };
};

const useBoardListHook = (page: number, limit: number) => {
  return boardListFetch(page, limit);
};

export default useBoardListHook;
