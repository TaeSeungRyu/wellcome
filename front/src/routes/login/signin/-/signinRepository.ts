import { API } from "@/const";
import { ApiClient } from "@/services/apiClient";

/**
 * 로그인 API 요청을 수행하는 함수 모음
 * 파일 네이밍은 **Repository 로 통일
 * 함수 네이밍은 request** 로 통일
 */

const requestSignin = async (username: string, password: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "post",
    body: JSON.stringify({
      username,
      password,
    }),
  };
  return apiClient.request(API.LOGIN, params);
};

const requestTest = async () => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
  };
  return apiClient.request(API.TEST_URL, params);
};

export { requestSignin, requestTest };
