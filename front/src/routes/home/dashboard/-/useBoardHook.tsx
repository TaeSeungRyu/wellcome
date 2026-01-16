import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestBoardDelete,
  requestBoardDetail,
  requestBoardInsert,
  requestBoardList,
  requestBoardUpdate,
} from "./boardRepository";
import { useForm } from "react-hook-form";
import { boardSchema, commentSchema } from "./board.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const queryKey = ["useBoardListHook", "useBoardAlter", "useBoardForm"];
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
export const useBoardForm = (_id?: string) => {
  const form = useForm({
    resolver: zodResolver(boardSchema),
    mode: "all",
    defaultValues: {
      title: "",
      contents: "",
    },
  });
  const { reset } = form;
  // 수정 모드일 때만 데이터 조회 및 폼 채우기
  const { isFetching, data, isError } = useQuery({
    queryKey: [...queryKey[2], _id],
    queryFn: () => requestBoardDetail(_id!),
    enabled: !!_id,
  });
  // 데이터가 로드되면 폼 값을 한 번에 업데이트
  useEffect(() => {
    if (data?.result?.data) {
      reset({
        title: data.result.data.title,
        contents: data.result.data.contents,
      });
    }
  }, [data, reset]);
  return { ...form, isFetching, isError };
};

//BOARD 등록/수정용 HOOK
export const useBoardAlter = () => {
  return useMutation({
    mutationKey: [...queryKey[1]],
    mutationFn: async ({
      title,
      contents,
      _id,
      isDelete,
    }: {
      title: string;
      contents: string;
      _id?: string;
      isDelete?: boolean;
    }) => {
      if (isDelete && _id) {
        return await requestBoardDelete(_id);
      } else if (_id) {
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

//BOARD COMMENT FORM용 HOOK
export const useBoardCommentForm = (_id?: string) => {
  const form = useForm({
    resolver: zodResolver(commentSchema),
    mode: "all",
    defaultValues: {
      comment: "",
    },
  });

  return { ...form };
};
