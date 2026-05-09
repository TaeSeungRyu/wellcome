import { API } from "@/const";
import { api } from "@/services/api";
import type { ApiResponse } from "@/shared/api/types";

export interface SigninResult {
  success?: boolean;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    username: string;
  };
}

const requestSignin = (username: string, password: string) =>
  api.post<ApiResponse<SigninResult>>(API.LOGIN, { username, password });

export { requestSignin };
