import { API } from "@/const";
import { ApiClient } from "@/services/apiClient";

const requestBoardList = async (page: number, limit: number) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: {
      page,
      limit,
    },
  };
  return apiClient.request(API.BOARD, params);
};

export { requestBoardList };
