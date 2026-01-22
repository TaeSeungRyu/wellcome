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

export { requestUserList };
