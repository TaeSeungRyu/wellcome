import { useQuery } from "@tanstack/react-query";
import { requestUserList } from "./user.repository";

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
