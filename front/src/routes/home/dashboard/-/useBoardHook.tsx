import { useQuery } from "@tanstack/react-query";
import { requestBoardList } from "./boardRepository";
import { useForm } from "react-hook-form";
import { boardSchema } from "./board.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const queryKey = ["useBoardListHook"];
const _boardListFetch = (page: number, limit: number) => {
  return useQuery({
    queryKey: [...queryKey, page, limit],
    queryFn: async () => {
      return await requestBoardList(page, limit);
    },
    enabled: false,
    gcTime: 0,
    staleTime: 0,
    select(data) {
      return data?.result ?? null;
    },
    placeholderData: (prev) => prev,
  });
};

export const useBoardListHook = (page: number, limit: number) => {
  return _boardListFetch(page, limit);
};

export const useBoardForm = () => {
  return useForm({
    resolver: zodResolver(boardSchema),
    mode: "all",
    defaultValues: {
      title: "",
      contents: "",
    },
  });
};
