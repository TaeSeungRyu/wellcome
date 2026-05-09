import { API, API_BASE_URL } from "@/const";
import { api } from "@/services/api";
import type { ApiResponse } from "@/shared/api/types";
import type { Auth } from "@/features/auth/schema";
import type { User } from "./user.schema";

export interface UserListResult {
  success?: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface UserAuthListResult {
  success?: boolean;
  data: {
    auths: Auth[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface UserDetailResult {
  success?: boolean;
  data: User;
}

export interface UserMutationResult {
  success?: boolean;
  data?: User;
}

export interface UserExistsResult {
  success?: boolean;
  data: {
    exists: boolean;
  };
}

const requestUserList = (page: number, limit: number) =>
  api.get<ApiResponse<UserListResult>>(API.USER, { page, limit });

const requestUserAuthList = () =>
  api.get<ApiResponse<UserAuthListResult>>(API.AUTH_LIST, {
    page: 1,
    limit: 10000,
  });

const requestUserCreate = (data: User) =>
  api.post<ApiResponse<UserMutationResult>>(API.USER_CREATE, data);

const requestUserCreateWithFile = (
  data: Record<string, unknown>,
  file?: File,
) =>
  api.multipart.post<ApiResponse<UserMutationResult>>(
    API.USER_CREATE_FILE,
    data,
    file,
  );

const requestUserCheckExist = (username: string) =>
  api.get<ApiResponse<UserExistsResult>>(API.USER_CHECK_EXIST, { username });

const requestUserDetail = (username: string) =>
  api.get<ApiResponse<UserDetailResult>>(API.USER_DETAIL, { username });

const requestUserDelete = (username: string) =>
  api.delete<ApiResponse<UserMutationResult>>(
    API.USER_DELETE,
    undefined,
    { username },
  );

const requestUserUpdate = (data: User) =>
  api.put<ApiResponse<UserMutationResult>>(API.USER_UPDATE, data);

const requestUserUpdateWithFile = (
  data: Record<string, unknown>,
  file?: File,
) =>
  api.multipart.put<ApiResponse<UserMutationResult>>(
    API.USER_UPDATE_FILE,
    data,
    file,
  );

const requestImagePreview = (imagePath: string) =>
  api.getBlob(`${API_BASE_URL}${imagePath}`);

export {
  requestUserList,
  requestUserAuthList,
  requestUserCreate,
  requestUserCheckExist,
  requestUserDetail,
  requestUserDelete,
  requestUserUpdate,
  requestUserCreateWithFile,
  requestUserUpdateWithFile,
  requestImagePreview,
};
