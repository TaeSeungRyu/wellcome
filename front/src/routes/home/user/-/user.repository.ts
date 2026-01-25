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

export { requestUserList, requestUserAuthList, requestUserCreate };
