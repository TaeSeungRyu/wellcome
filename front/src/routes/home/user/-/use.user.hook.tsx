import { useQuery } from "@tanstack/react-query";
import { requestUserAuthList, requestUserList } from "./user.repository";
import { useForm } from "react-hook-form";
import { userSchema } from "./user.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const queryKey = ["requestUserList"] as const;
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
