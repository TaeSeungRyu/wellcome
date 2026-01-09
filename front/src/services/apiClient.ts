import { API } from "@/const";
import {
  clearTokens,
  getAccessToken,
  REFRESH_TOKEN_KEY,
  setAccessToken,
} from "@/context/authContext";

const _performFetch = async (
  url: string,
  currentOptions: RequestInit,
  currentToken: string | null
): Promise<any> => {
  const res = await fetch(url, {
    ...currentOptions,
    headers: {
      "Content-Type": "application/json",
      ...(currentOptions?.headers || {}),
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
    },
  });
  if (res.status === 401) throw new Error("401");
  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));
    throw new Error(
      `HTTP error! status: ${res.status}, message: ${errorBody.message}`
    );
  }
  return res.json() as Promise<any>;
};

// 2. 토큰을 리프레시하는 함수
const _refreshAccessToken = async (): Promise<string> => {
  const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!currentRefreshToken) {
    throw new Error("No refresh token available.");
  }
  const res = await fetch(API.LOGIN_REFRESH, {
    method: "get",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    //body: JSON.stringify({ token: currentRefreshToken }),
  });
  const { data, success } = await res.json();
  setAccessToken(data?.accessToken);
  if (!success) {
    throw new Error("Failed to refresh token.");
  }
  return data?.accessToken;
};

// 3. ApiClient 클래스
export class ApiClient {
  private constructor() {}
  private static instance: ApiClient | null = null;

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // HTTP 요청을 수행하는 핵심 메서드
  public async request<T = any>(
    url: string,
    options: Record<string, any>
  ): Promise<T> {
    // 요청을 수행하고 401 에러를 처리하는 내부 헬퍼 함수
    try {
      // 1. 첫 번째 요청 시도 (로컬 스토리지의 현재 토큰 사용)
      const currentToken = getAccessToken();
      if (options.query) {
        const queryParams = new URLSearchParams(options.query).toString();
        url += `?${queryParams}`;
      }
      return await _performFetch(url, options, currentToken);
    } catch (err: any) {
      if (err.message.includes("401")) {
        try {
          const newToken = await _refreshAccessToken();
          setAccessToken(newToken);
          // 2. 토큰 갱신 후 요청 재시도
          return await _performFetch(url, options, newToken);
        } catch (refreshErr) {
          console.error("Token refresh or retry failed:", refreshErr);
          clearTokens(); // 로컬 스토리지 토큰 제거
          throw new Error("Session expired. Please log in again.");
        }
      }
      // 401이 아닌 다른 에러는 그대로 throw
      throw err;
    }
  }
}
