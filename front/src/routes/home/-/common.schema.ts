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
