// 도메인 무관 API 응답 타입과 유틸. 모든 repository/hook이 공유한다.

export interface ApiResponse<T = unknown> {
  message?: string;
  result: T;
}

export interface RequestResult<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}

export function resultMapper<T>(res: any, key: string): RequestResult<T> {
  return {
    data: res[key],
    total: res?.total,
    page: res?.page,
    limit: res?.limit,
  } as RequestResult<T>;
}
