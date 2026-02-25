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

import { useNavigate, useSearch } from "@tanstack/react-router";
import { useRef, useEffect, useCallback } from "react";

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 300,
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function useRouteQuerySync(
  filters: Record<string, any>,
  fetchCallback: (query: any) => void,
) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const isFirstRender = useRef(true);

  // 1. URL 업데이트 함수
  const updateUrl = useCallback(
    (nextQuery: Record<string, any>) => {
      navigate({
        to: ".",
        search: nextQuery, // 여기서 객체를 넘기면 TanStack Router가 처리합니다.
        replace: true,
      });
    },
    [navigate],
  );

  const debouncedUpdateUrl = useRef(
    debounce((query: any) => updateUrl(query), 300),
  ).current;

  // 2. [감시] filters 객체의 값들을 문자열화하여 변화 감지 (의존성용)
  const filterValues = JSON.stringify(filters);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const nextQuery: Record<string, any> = {};
    Object.keys(filters).forEach((key) => {
      const val = filters[key];

      // null, undefined, 빈 문자열 제외
      if (val !== undefined && val !== null && val !== "") {
        // 중요: 따옴표가 생기지 않도록 원시 값(Primitive)으로 할당
        // TanStack Router 스키마 설정에 따라 숫자는 숫자 그대로 넘기는 것이 좋습니다.
        nextQuery[key] = val;
      }
    });

    debouncedUpdateUrl(nextQuery);
  }, [filterValues, debouncedUpdateUrl]);

  // 3. URL 변경 시 콜백
  useEffect(() => {
    fetchCallback(search);
  }, [search, fetchCallback]);

  return { handleSearch: () => {} };
}
