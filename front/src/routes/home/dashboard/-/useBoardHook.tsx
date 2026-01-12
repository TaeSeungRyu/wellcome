import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestBoardInsert,
  requestBoardList,
  requestBoardUpdate,
} from "./boardRepository";
import { useForm } from "react-hook-form";
import { boardSchema } from "./board.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const queryKey = ["useBoardListHook", "useBoardAlter"];
//BOARD LIST 조회용 HOOK
export const useBoardListHook = (page: number, limit: number) => {
  return useQuery({
    queryKey: [...queryKey[0], page, limit],
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

//BOARD FORM용 HOOK
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

//BOARD 등록/수정용 HOOK
export const useBoardAlter = () => {
  return useMutation({
    mutationKey: [...queryKey[1]],
    mutationFn: async ({
      title,
      contents,
      _id,
    }: {
      title: string;
      contents: string;
      _id?: string;
    }) => {
      if (_id) {
        return await requestBoardUpdate(_id, title, contents);
      } else {
        return await requestBoardInsert(title, contents);
      }
    },
    onSuccess: (response) => {
      return response.result;
    },
    onError: (error: Error) => {
      throw error;
    },
  });
};
