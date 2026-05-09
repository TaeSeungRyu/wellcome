import { API } from "@/const";
import { api } from "@/services/api";
import type { ApiResponse } from "@/shared/api/types";
import type { Auth } from "./schema";

export interface AuthListResult {
  success?: boolean;
  data: {
    auths: Auth[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AuthDetailResult {
  success?: boolean;
  data: Auth;
}

export interface AuthMutationResult {
  success?: boolean;
  data?: Auth;
}

export interface AuthCodeExistResult {
  success: boolean;
}

const requestAuthList = (page: number, limit: number) =>
  api.get<ApiResponse<AuthListResult>>(API.AUTH_LIST, { page, limit });

const requestAuthCreate = (data: Auth) =>
  api.post<ApiResponse<AuthMutationResult>>(API.AUTH_CREATE, data);

const requestAuthDetail = (_id: string) =>
  api.get<ApiResponse<AuthDetailResult>>(API.AUTH_DETAIL, { _id });

const requestAuthDelete = (_id: string) =>
  api.delete<ApiResponse<AuthMutationResult>>(API.AUTH_DELETE, { _id });

const requestAuthUpdate = (data: Auth & { _id: string }) =>
  api.put<ApiResponse<AuthMutationResult>>(API.AUTH_UPDATE, data);

const requestIsAuthCodeExist = (code: string) =>
  api.get<ApiResponse<AuthCodeExistResult>>(API.AUTH_CODE_EXIST, { code });

export {
  requestAuthList,
  requestAuthCreate,
  requestAuthDetail,
  requestAuthDelete,
  requestAuthUpdate,
  requestIsAuthCodeExist,
};
