import { API } from "@/const";
import { ApiClient } from "@/services/apiClient";

const requestAuthList = async (page: number, limit: number) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: {
      page,
      limit,
    },
  };
  return apiClient.request(API.AUTH_LIST, params);
};

const requestAuthCreate = async (data: any) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "post",
    body: JSON.stringify(data),
  };
  return apiClient.request(API.AUTH_CREATE, params);
};

const requestAuthDetail = async (username: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: { username },
  };
  return apiClient.request(`${API.AUTH_DETAIL}`, params);
};

const requestAuthDelete = async (username: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "delete",
    body: JSON.stringify({ username }),
  };
  return apiClient.request(`${API.AUTH_DELETE}`, params);
};

const requestAuthUpdate = async (data: any) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "put",
    body: JSON.stringify(data),
  };
  return apiClient.request(API.AUTH_UPDATE, params);
};

const requestIsAuthCodeExist = async (code: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: { code },
  };
  return apiClient.request(`${API.AUTH_CODE_EXIST}`, params);
};

export {
  requestAuthList,
  requestAuthCreate,
  requestAuthDetail,
  requestAuthDelete,
  requestAuthUpdate,
  requestIsAuthCodeExist,
};
