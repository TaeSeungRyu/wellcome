import { ApiClient } from "./apiClient";
import { ApiMultipartClient } from "./apiClientMultipart";

// 공개 API 호출 인터페이스. 모든 repository는 이 모듈만 사용한다.
// 토큰 갱신 / 401 재시도 / 헤더 처리 등은 ApiClient(Multipart) 내부에서 처리.

type Query = Record<string, string | number | boolean | undefined>;

const get = <T>(url: string, query?: Query): Promise<T> =>
  ApiClient.getInstance().request<T>(url, { method: "get", query });

const post = <T>(url: string, body?: unknown): Promise<T> =>
  ApiClient.getInstance().request<T>(url, {
    method: "post",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

const put = <T>(url: string, body?: unknown): Promise<T> =>
  ApiClient.getInstance().request<T>(url, {
    method: "put",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

const del = <T>(url: string, query?: Query, body?: unknown): Promise<T> =>
  ApiClient.getInstance().request<T>(url, {
    method: "delete",
    query,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

const getBlob = (url: string): Promise<Blob> =>
  ApiClient.getInstance().request<Blob>(url, {
    method: "get",
    contentType: "blob",
  });

const multipart = {
  post: <T>(
    url: string,
    data: Record<string, unknown>,
    file?: File,
  ): Promise<T> =>
    ApiMultipartClient.getInstance().postMultipart<T>(url, data, file),
  put: <T>(
    url: string,
    data: Record<string, unknown>,
    file?: File,
  ): Promise<T> =>
    ApiMultipartClient.getInstance().postMultipart<T>(url, data, file, "PUT"),
};

export const api = {
  get,
  post,
  put,
  delete: del,
  getBlob,
  multipart,
};
