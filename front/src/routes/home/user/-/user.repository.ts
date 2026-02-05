import { API } from "@/const";
import { ApiClient } from "@/services/apiClient";
import { ApiMultipartClient } from "@/services/apiClientMultipart";

const requestUserList = async (page: number, limit: number) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: {
      page,
      limit,
    },
  };
  return apiClient.request(API.USER, params);
};

const requestUserAuthList = async () => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: {
      page: 1,
      limit: 10000,
    },
  };
  return apiClient.request(API.AUTH_LIST, params);
};

const requestUserCreate = async (data: any) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "post",
    body: JSON.stringify(data),
  };
  return apiClient.request(API.USER_CREATE, params);
};

const requestUserCreateWithFile = async (data: any, file?: File) => {
  const apiClient = ApiMultipartClient.getInstance();
  return apiClient.postMultipart(API.USER_CREATE, data, file);
};

const requestUserCheckExist = async (username: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: { username },
  };
  return apiClient.request(API.USER_CHECK_EXIST, params);
};

const requestUserDetail = async (username: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: { username },
  };
  return apiClient.request(`${API.USER_DETAIL}`, params);
};

const requestUserDelete = async (username: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "delete",
    body: JSON.stringify({ username }),
  };
  return apiClient.request(`${API.USER_DELETE}`, params);
};

const requestUserUpdate = async (data: any) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "put",
    body: JSON.stringify(data),
  };
  return apiClient.request(API.USER_UPDATE, params);
};
export {
  requestUserList,
  requestUserAuthList,
  requestUserCreate,
  requestUserCheckExist,
  requestUserDetail,
  requestUserDelete,
  requestUserUpdate,
};
