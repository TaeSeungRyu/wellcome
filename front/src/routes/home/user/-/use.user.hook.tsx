import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestImagePreview,
  requestUserAuthList,
  requestUserCheckExist,
  requestUserCreate,
  requestUserCreateWithFile,
  requestUserDelete,
  requestUserDetail,
  requestUserList,
  requestUserUpdate,
  requestUserUpdateWithFile,
} from "./user.repository";
import { useForm } from "react-hook-form";
import { updatedUserSchema, userSchema, type User } from "./user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

const queryKey = ["requestUserList", "requestUserAlter"] as const;
//LIST 조회용 HOOK
export const useUserListHook = (page: number, limit: number) => {
  return useQuery({
    queryKey: [...queryKey[0], page, limit],
    queryFn: async () => {
      return await requestUserList(page, limit);
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
    select(data) {
      return (
        data?.data?.auths.map((key: Record<string, any>) => ({
          value: key.code,
          label: key.name,
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

  const form = useForm({
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
          role: authList.map((auth: any) => ({
            ...auth,
            selected: info.role?.includes(auth.value),
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
        role: authList.map((auth: any) => ({
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

//BOARD 등록/수정용 HOOK
export const useUserAlter = () => {
  return useMutation({
    mutationKey: [...queryKey[1]],
    mutationFn: async ({
      username,
      password,
      name,
      role,
      email,
      phone,
      isDelete,
      isUpdate,
      file,
      profileImage,
    }: {
      username?: string;
      password?: string;
      name?: string;
      role?: string[];
      email?: string;
      phone?: string;
      isDelete?: boolean;
      isUpdate?: boolean;
      file?: any;
      profileImage?: string;
    }) => {
      const param = {
        username,
        password,
        name,
        role,
        email: email,
        phone: phone,
        profileImage,
      };
      param.role = role
        ?.filter((role: any) => {
          return role.selected;
        })
        .map((role: any) => {
          return role.value;
        });
      if (isDelete && username) {
        return await requestUserDelete(username);
      } else if (username && isUpdate) {
        if (param.phone === "") delete param.phone;
        if (param.email === "") delete param.email;
        if (param.password === "") delete param.password;
        return await requestUserUpdateWithFile(param, file[0]);
      } else {
        if (param.phone === "") delete param.phone;
        if (param.email === "") delete param.email;
        return await requestUserCreateWithFile(param, file[0]);
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

export const useUserDetail = (username: string) => {
  return useQuery({
    queryKey: ["requestUserDetail"],
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
