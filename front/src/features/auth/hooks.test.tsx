import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { createWrapper } from "@/test/test-utils";
import { useAuthCreate, useAuthListHook } from "./hooks";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useAuthListHook (msw integration)", () => {
  it("기본 응답을 받아 resultMapper가 매핑한 데이터를 반환한다", async () => {
    const { result } = renderHook(() => useAuthListHook(1, 10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).not.toBeNull();
    });

    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.data?.[0].code).toBe("ADMIN");
    expect(result.current.data?.total).toBe(2);
    expect(result.current.data?.limit).toBe(10);
  });

  it("응답이 빈 list여도 data: [] 로 매핑된다", async () => {
    server.use(
      http.get("/api/auth-code/list", () =>
        HttpResponse.json({
          message: "ok",
          result: {
            success: true,
            data: { auths: [], total: 0, page: 1, limit: 10 },
          },
        }),
      ),
    );

    const { result } = renderHook(() => useAuthListHook(1, 10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(result.current.data?.data).toEqual([]);
    expect(result.current.data?.total).toBe(0);
  });

  it("서버 에러 시 query는 error 상태가 된다", async () => {
    server.use(
      http.get("/api/auth-code/list", () =>
        HttpResponse.json(
          { message: "internal error" },
          { status: 500 },
        ),
      ),
    );

    const { result } = renderHook(() => useAuthListHook(1, 10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe("useAuthCreate (msw integration)", () => {
  it("POST 호출 후 응답의 success를 받는다", async () => {
    const { result } = renderHook(() => useAuthCreate(), {
      wrapper: createWrapper(),
    });

    let response;
    await act(async () => {
      response = await result.current.mutateAsync({
        code: "TEST",
        name: "테스트",
        desc: "설명",
      });
    });

    expect(response).toBeDefined();
    expect(response!.result.success).toBe(true);
    expect(response!.result.data?._id).toBe("new-id");
  });

  it("서버 에러 시 mutateAsync가 reject된다", async () => {
    server.use(
      http.post("/api/auth-code/create", () =>
        HttpResponse.json({ message: "bad" }, { status: 400 }),
      ),
    );

    const { result } = renderHook(() => useAuthCreate(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({ code: "X", name: "x", desc: "d" }),
    ).rejects.toThrow();
  });
});
