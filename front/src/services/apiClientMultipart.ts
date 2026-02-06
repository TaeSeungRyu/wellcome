import { API } from "@/const";
import {
  clearTokens,
  getAccessToken,
  setAccessToken,
} from "@/context/auth.context";

// 1. fetch 핵심 로직 분리
const _performFetch = async (
  url: string,
  currentOptions: RequestInit,
  currentToken: string | null,
): Promise<any> => {
  const isFormData = currentOptions.body instanceof FormData;
  const headers = new Headers(currentOptions.headers);
  // FormData가 아닐 때만 기본 Content-Type 설정
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  // 인증 토큰 추가
  if (currentToken) {
    headers.set("Authorization", `Bearer ${currentToken}`);
  }
  const res = await fetch(url, {
    ...currentOptions,
    headers,
  });
  if (res.status === 401) throw new Error("401");
  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));
    throw new Error(
      `HTTP error! status: ${res.status}, message: ${errorBody.message}`,
    );
  }
  return res.json();
};

// 2. 토큰을 리프레시하는 함수
const _refreshAccessToken = async (): Promise<string> => {
  const res = await fetch(API.LOGIN_REFRESH, {
    method: "get",
  });
  const { result } = await res.json();
  setAccessToken(result?.accessToken);
  if (!result.success) {
    throw new Error("Failed to refresh token.");
  }
  return result?.accessToken;
};

// 2. ApiClient 클래스
export class ApiMultipartClient {
  private static instance: ApiMultipartClient | null = null;
  private constructor() {}

  public static getInstance(): ApiMultipartClient {
    if (!ApiMultipartClient.instance) {
      ApiMultipartClient.instance = new ApiMultipartClient();
    }
    return ApiMultipartClient.instance;
  }

  async request<T = any>(
    url: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      body?: any;
      query?: Record<string, string>;
      headers?: Record<string, string>;
    },
  ): Promise<T> {
    try {
      const currentToken = getAccessToken();
      let targetUrl = url;

      // 쿼리 스트링 처리
      if (options.query) {
        const queryParams = new URLSearchParams(options.query).toString();
        targetUrl += `?${queryParams}`;
      }

      // 바디 처리 (FormData면 그대로, 객체면 JSON.stringify)
      const fetchOptions: RequestInit = {
        method: options.method || "GET",
        headers: options.headers,
        body:
          options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body),
      };

      return await _performFetch(targetUrl, fetchOptions, currentToken);
    } catch (err: any) {
      if (err.message.includes("401")) {
        try {
          const newToken = await _refreshAccessToken();
          return await _performFetch(
            url,
            {
              ...options,
              body:
                options.body instanceof FormData
                  ? options.body
                  : JSON.stringify(options.body),
            },
            newToken,
          );
        } catch (refreshErr) {
          clearTokens();
          throw new Error("Session expired. Please log in again.");
        }
      }
      throw err;
    }
  }

  /**
   * 파일 업로드를 위한 전용 메서드 (편의용)
   */
  public async postMultipart<T = any>(
    url: string,
    data: Record<string, any>,
    file?: File,
  ): Promise<T> {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // 배열인 경우 (예: role) 같은 키로 여러 번 append 하거나 처리
          value.forEach((v) => formData.append(key, v));
        } else if (typeof value === "object" && !(value instanceof File)) {
          // 객체인 경우 문자열화 (필요 시)
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    if (file) {
      formData.append("file", file);
    }

    return this.request<T>(url, {
      method: "POST",
      body: formData,
    });
  }
}
