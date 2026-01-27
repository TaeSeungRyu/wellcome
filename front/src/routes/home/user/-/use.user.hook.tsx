import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestUserAuthList,
  requestUserCheckExist,
  requestUserCreate,
  requestUserDetail,
  requestUserList,
} from "./user.repository";
import { useForm } from "react-hook-form";
import { userSchema, type User } from "./user.schema";
import { zodResolver } from "@hookform/resolvers/zod";

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
        data?.data?.map((key: string) => ({
          value: key,
          label: key,
          selected: false,
        })) ?? []
      );
    },
  });
};

export const useUserForm = (_id?: string) => {
  const form = useForm({
    resolver: zodResolver(userSchema),
    mode: "all",
    defaultValues: {
      username: "",
      password: "",
      name: "",
      accessDate: "",
      role: [],
      email: "",
      phone: "",
    },
  });
  return { ...form };
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
      _id,
      isDelete,
    }: {
      username: string;
      password: string;
      name: string;
      role: string[];
      email?: string;
      phone?: string;
      _id?: string;
      isDelete?: boolean;
    }) => {
      const param = {
        username,
        password,
        name,
        role,
        email: email,
        phone: phone,
      };
      param.role = role
        .filter((role: any) => {
          return role.selected;
        })
        .map((role: any) => {
          return role.value;
        });
      if (isDelete && _id) {
        //  return await requestUserDelete(_id);
      } else if (_id) {
        // return await requestUserUpdate(_id, username, password, name, role, email, phone);
      } else {
        if (param.phone === "") delete param.phone;
        if (param.email === "") delete param.email;
        return await requestUserCreate(param);
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
    queryKey: ["requestUserDetail", username],
    queryFn: async () => {
      return await requestUserDetail(username);
    },
    enabled: true,
    gcTime: 0,
    staleTime: 0,
    placeholderData: (prev) => prev,
    select(data) {
      return (data?.result?.data as User) ?? null;
    },
  });
};
