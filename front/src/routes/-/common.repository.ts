import { API } from "@/const";
import { ApiClient } from "@/services/apiClient";

const requestConstList = async () => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
  };
  return apiClient.request(API.CONST_LIST, params);
};

export { requestConstList };
