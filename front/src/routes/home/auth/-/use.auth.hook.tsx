import { useQuery } from "@tanstack/react-query";
import { requestAuthList } from "./auth.repository";

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
      return data?.result ?? null;
    },
    initialData: initialData ? { result: initialData } : undefined,
    staleTime: 0,
  });
};
