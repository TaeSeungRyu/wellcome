import { API } from "@/const";
import { api } from "@/services/api";
import type { ApiResponse } from "../home/-/common.schema";

export interface ConstListResult {
  data: Record<string, string>;
}

const requestConstList = () =>
  api.get<ApiResponse<ConstListResult>>(API.CONST_LIST);

export { requestConstList };
