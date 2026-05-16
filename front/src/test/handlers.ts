import { http, HttpResponse } from "msw";
import type { ApiResponse } from "@/shared/api/types";
import type {
  AuthListResult,
  AuthMutationResult,
} from "@/features/auth/api";
import type { Auth } from "@/features/auth/schema";
import type { SigninResult } from "@/features/auth/signin.api";
import type { ConstListResult } from "@/shared/api/const";
import type {
  BoardListResult,
  BoardMutationResult,
} from "@/features/board/api";

// 공통 mock 핸들러.
// - vitest(jsdom): node 환경에서 server.ts가 사용
// - 브라우저: browser.ts의 service worker가 사용 (E2E + 백엔드 없는 dev)

// ─── 인증 ─────────────────────────────────────────────────────────
const signinHandler = http.post("/api/auth/login", async () => {
  const body: ApiResponse<SigninResult> = {
    message: "로그인 성공",
    result: {
      success: true,
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      data: { username: "tester" },
    },
  };
  return HttpResponse.json(body);
});

// ─── 공통 상수 ────────────────────────────────────────────────────
const constListHandler = http.get("/api/const/list", () => {
  const body: ApiResponse<ConstListResult> = {
    message: "ok",
    result: { data: {} },
  };
  return HttpResponse.json(body);
});

// ─── 권한 코드 (auth-code) ────────────────────────────────────────
const authListHandler = http.get("/api/auth-code/list", () => {
  const body: ApiResponse<AuthListResult> = {
    message: "ok",
    result: {
      success: true,
      data: {
        auths: [
          { _id: "1", code: "ADMIN", name: "관리자", desc: "최고 권한" },
          { _id: "2", code: "USER", name: "사용자", desc: "일반 권한" },
        ],
        total: 2,
        page: 1,
        limit: 10,
      },
    },
  };
  return HttpResponse.json(body);
});

const authCreateHandler = http.post(
  "/api/auth-code/create",
  async ({ request }) => {
    const data = (await request.json()) as Auth;
    const body: ApiResponse<AuthMutationResult> = {
      message: "created",
      result: { success: true, data: { ...data, _id: "new-id" } },
    };
    return HttpResponse.json(body);
  },
);

// ─── 게시판 (board) ──────────────────────────────────────────────
const boardListHandler = http.get("/api/board/list", () => {
  const body: ApiResponse<BoardListResult> = {
    message: "ok",
    result: {
      success: true,
      data: {
        boards: [
          {
            _id: "b1",
            title: "샘플 게시글",
            contents: "내용입니다",
            username: "tester",
            createDate: "2025-01-01T00:00:00.000Z",
            comments: [],
          },
        ],
        total: 1,
        page: 1,
        limit: 5,
      },
    },
  };
  return HttpResponse.json(body);
});

const boardCreateHandler = http.post(
  "/api/board/create",
  async ({ request }) => {
    const data = (await request.json()) as { title: string; contents: string };
    const body: ApiResponse<BoardMutationResult> = {
      message: "created",
      result: {
        success: true,
        data: {
          _id: "new-board",
          title: data.title,
          contents: data.contents,
          username: "tester",
          createDate: new Date().toISOString(),
        },
      },
    };
    return HttpResponse.json(body);
  },
);

// SSE는 service worker가 stream 응답 처리 어려우므로 빈 응답 (연결 즉시 종료)
const sseHandler = http.get("/api/events/sse/*", () => {
  return new HttpResponse("", {
    headers: { "Content-Type": "text/event-stream" },
  });
});

export const handlers = [
  signinHandler,
  constListHandler,
  authListHandler,
  authCreateHandler,
  boardListHandler,
  boardCreateHandler,
  sseHandler,
];
