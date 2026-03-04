import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestAuthCreate,
  requestAuthDelete,
  requestAuthDetail,
  requestAuthList,
  requestIsAuthCodeExist,
} from "./auth.repository";
import { resultMapper } from "../../-/common.schema";
import { authSchema, type Auth } from "./auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const queryKey = ["requestAuthList", "requestAuthAlter"] as const;
//LIST 조회용 HOOK
export const useAuthListHook = (
  page: number,
  limit: number,
  initialData: any = null,
) => {
  return useQuery({
    queryKey: [...queryKey[0], page, limit],
    queryFn: async () => {
      return await requestAuthList(page, limit);
    },
    select(data) {
      if (data?.result) {
        return resultMapper<Auth[]>(data.result.data, "auths");
      }
      return null;
    },
    initialData: initialData ? { result: initialData } : undefined,
    staleTime: 0,
    placeholderData: (prev) => prev,
  });
};

export const useAuthCodeExist = (code: string) => {
  return useQuery({
    queryKey: ["useAuthCodeExist"],
    queryFn: async () => {
      if (!code) return false; // 코드가 없으면 존재하지 않는 것으로 간주
      return await requestIsAuthCodeExist(code);
    },
    enabled: false,
    staleTime: 1 * 60 * 1000, // 1분 동안 캐시 유지
    select(data) {
      if (!data) {
        return {
          message: "코드 존재 여부를 확인할 수 없습니다.",
          success: false,
        };
      }
      return {
        message: data.message,
        success: data.result.success,
      };
    },
  });
};

export const useAuthForm = () => {
  return useForm({
    resolver: zodResolver(authSchema),
    mode: "all",
    defaultValues: {
      code: "",
      name: "",
      desc: "",
    },
    shouldUnregister: false,
  });
};

//등록/수정용 HOOK
export const useAuthAlter = () => {
  return useMutation({
    mutationKey: [...queryKey[1]],
    mutationFn: async ({
      code,
      name,
      desc,
      isDelete = false,
      isUpdate = false,
      _id,
    }: {
      code?: string;
      name?: string;
      desc?: string;
      isDelete?: boolean;
      isUpdate?: boolean;
      _id?: string;
    }) => {
      if (isUpdate) {
      } else if (isDelete) {
        return await requestAuthDelete(_id!);
      } else {
        return await requestAuthCreate({ code, name, desc });
      }
    },
    onSuccess: (response) => {
      return response;
    },
    onError: (error: Error) => {
      throw error;
    },
  });
};

export const useAuthDetail = (_id: string) => {
  return useQuery({
    queryKey: ["useAuthDetail", _id],
    queryFn: async () => {
      return await requestAuthDetail(_id);
    },
    select(data) {
      if (data?.result) {
        return resultMapper<Auth>(data.result, "data");
      }
      return null;
    },
  });
};
