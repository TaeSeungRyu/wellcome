import { API } from "@/const";
import { ApiClient } from "@/services/apiClient";
import type { ApiResponse } from "../../-/common.schema";
import type { Auth } from "./auth.schema";

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

const requestAuthList = async (
  page: number,
  limit: number,
): Promise<ApiResponse<AuthListResult>> => {
  const apiClient = ApiClient.getInstance();
  return apiClient.request<ApiResponse<AuthListResult>>(API.AUTH_LIST, {
    method: "get",
    query: { page, limit },
  });
};

const requestAuthCreate = async (
  data: Auth,
): Promise<ApiResponse<AuthMutationResult>> => {
  const apiClient = ApiClient.getInstance();
  return apiClient.request<ApiResponse<AuthMutationResult>>(API.AUTH_CREATE, {
    method: "post",
    body: JSON.stringify(data),
  });
};

const requestAuthDetail = async (
  _id: string,
): Promise<ApiResponse<AuthDetailResult>> => {
  const apiClient = ApiClient.getInstance();
  return apiClient.request<ApiResponse<AuthDetailResult>>(API.AUTH_DETAIL, {
    method: "get",
    query: { _id },
  });
};

const requestAuthDelete = async (
  _id: string,
): Promise<ApiResponse<AuthMutationResult>> => {
  const apiClient = ApiClient.getInstance();
  return apiClient.request<ApiResponse<AuthMutationResult>>(API.AUTH_DELETE, {
    method: "delete",
    query: { _id },
  });
};

const requestAuthUpdate = async (
  data: Auth & { _id: string },
): Promise<ApiResponse<AuthMutationResult>> => {
  const apiClient = ApiClient.getInstance();
  return apiClient.request<ApiResponse<AuthMutationResult>>(API.AUTH_UPDATE, {
    method: "put",
    body: JSON.stringify(data),
  });
};

const requestIsAuthCodeExist = async (
  code: string,
): Promise<ApiResponse<AuthCodeExistResult>> => {
  const apiClient = ApiClient.getInstance();
  return apiClient.request<ApiResponse<AuthCodeExistResult>>(
    API.AUTH_CODE_EXIST,
    { method: "get", query: { code } },
  );
};

export {
  requestAuthList,
  requestAuthCreate,
  requestAuthDetail,
  requestAuthDelete,
  requestAuthUpdate,
  requestIsAuthCodeExist,
};
