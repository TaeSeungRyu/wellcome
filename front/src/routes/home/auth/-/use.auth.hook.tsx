import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type AuthListResult,
  requestAuthCreate,
  requestAuthDelete,
  requestAuthDetail,
  requestAuthList,
  requestAuthUpdate,
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
  initialData: AuthListResult | null = null,
) => {
  return useQuery({
    queryKey: [...queryKey[0], page, limit],
    queryFn: async () => requestAuthList(page, limit),
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
      if (!code) return null; // 코드가 없으면 존재하지 않는 것으로 간주
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

export const useAuthCreate = () => {
  return useMutation({
    mutationKey: [...queryKey[1], "create"],
    mutationFn: async (data: Auth) => requestAuthCreate(data),
  });
};

export const useAuthUpdate = () => {
  return useMutation({
    mutationKey: [...queryKey[1], "update"],
    mutationFn: async (data: Auth & { _id: string }) => requestAuthUpdate(data),
  });
};

export const useAuthDelete = () => {
  return useMutation({
    mutationKey: [...queryKey[1], "delete"],
    mutationFn: async (_id: string) => requestAuthDelete(_id),
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
