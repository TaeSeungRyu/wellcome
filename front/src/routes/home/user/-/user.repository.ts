import { API } from "@/const";
import { ApiClient } from "@/services/apiClient";

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
