import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestImagePreview,
  requestUserAuthList,
  requestUserCheckExist,
  requestUserCreateWithFile,
  requestUserDelete,
  requestUserDetail,
  requestUserList,
  requestUserUpdateWithFile,
  type UserListResult,
} from "./api";
import { resultMapper } from "@/shared/api/types";
import { useForm } from "react-hook-form";
import {
  type RoleOption,
  type User,
  type UserForm,
  updatedUserSchema,
  userSchema,
} from "./schema";
import { buildUserPayload, type UserMutationInput } from "./payload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

export type { UserMutationInput };

const queryKey = ["requestUserList", "requestUserAlter"] as const;

//LIST 조회용 HOOK
export const useUserListHook = (
  page: number,
  limit: number,
  initialData: UserListResult | null = null,
) => {
  return useQuery({
    queryKey: [...queryKey[0], page, limit],
    queryFn: async () => requestUserList(page, limit),
    initialData: initialData ? { result: initialData } : undefined,
    staleTime: 0,
    select(data) {
      if (data?.result) {
        return resultMapper<User[]>(data.result.data, "users");
      }
      return null;
    },
    placeholderData: (prev) => prev,
  });
};

export const useUserAuthListHook = () => {
  return useQuery({
    queryKey: ["requestUserAuthList"],
    gcTime: Infinity,
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      const { result } = await requestUserAuthList();
      return result ?? null;
    },
    placeholderData: (prev) => prev,
    select(data): RoleOption[] {
      return (
        data?.data?.auths.map((auth) => ({
          value: auth.code,
          label: auth.name,
          selected: false,
        })) ?? []
      );
    },
  });
};
export const useUserForm = (username?: string) => {
  const { data: info, refetch } = useUserDetail(username || "");
  const { data: authList } = useUserAuthListHook();

  // 리셋 여부를 기억할 flag (리렌더링 시에도 유지됨)
  const isInitialized = useRef(false);

  const form = useForm<UserForm>({
    resolver: zodResolver(username ? updatedUserSchema : userSchema),
    mode: "all",
    defaultValues: {
      username: "",
      password: "",
      name: "",
      role: [],
      email: "",
      phone: "",
      profileImage: "",
    },
    shouldUnregister: false,
  });

  useEffect(() => {
    // 1. 이미 초기화가 끝났다면 더 이상 reset하지 않음
    if (isInitialized.current) return;

    // 2. 수정 모드: 유저 정보와 권한 리스트가 모두 왔을 때
    if (username && info && authList) {
      setTimeout(() => {
        form.reset({
          username: info.username,
          password: "",
          name: info.name,
          email: info.email || "",
          phone: info.phone || "",
          role: authList.map((auth) => ({
            ...auth,
            selected: info.role?.some((r) => r.value === auth.value) || false,
          })),
          profileImage: info.profileImage || "",
        });
        isInitialized.current = true; // 초기화 완료 표시
      }, 1);
    }
    // 3. 등록 모드: 권한 리스트만 왔을 때
    else if (!username && authList) {
      form.reset({
        ...form.getValues(),
        role: authList.map((auth) => ({
          ...auth,
          selected: false,
        })),
        profileImage: "",
      });
      isInitialized.current = true; // 초기화 완료 표시
    }
  }, [info, authList, username, form]);

  return { form, refetch };
};

export const useCheckExistUser = (username: string) => {
  return useQuery({
    queryKey: ["requestUserCheckExist", username],
    queryFn: async () => {
      return await requestUserCheckExist(username);
    },
    enabled: false,
    gcTime: 1000 * 1,
    staleTime: 1000 * 1,
    select(data) {
      return data?.result ?? null;
    },
    placeholderData: (prev) => prev,
  });
};

export const useUserCreate = () => {
  return useMutation({
    mutationKey: [...queryKey[1], "create"],
    mutationFn: async (input: UserMutationInput) => {
      const { payload, file } = buildUserPayload(input);
      return requestUserCreateWithFile(payload, file);
    },
  });
};

export const useUserUpdate = () => {
  return useMutation({
    mutationKey: [...queryKey[1], "update"],
    mutationFn: async (input: UserMutationInput) => {
      const { payload, file } = buildUserPayload(input);
      if (payload.password === "") delete payload.password;
      return requestUserUpdateWithFile(payload, file);
    },
  });
};

export const useUserDelete = () => {
  return useMutation({
    mutationKey: [...queryKey[1], "delete"],
    mutationFn: async (username: string) => requestUserDelete(username),
  });
};

export const useUserDetail = (username: string) => {
  return useQuery({
    queryKey: ["requestUserDetail", username],
    queryFn: async () => {
      return await requestUserDetail(username);
    },
    enabled: false,
    gcTime: 0,
    staleTime: 0,
    select(data) {
      return (data?.result?.data as User) ?? null;
    },
  });
};

export const useUserImageUrl = (profileImage: string) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  useEffect(() => {
    if (profileImage) {
      requestImagePreview(profileImage).then((blob) => {
        const url = URL.createObjectURL(blob);
        setImgSrc(url);
      });
    }
    return () => {
      if (imgSrc) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [profileImage]);
  return [imgSrc, setImgSrc] as const;
};
