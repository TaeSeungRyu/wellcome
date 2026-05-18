import { http, HttpResponse } from "msw";
import type { ApiResponse } from "@/shared/api/types";
import type {
  AuthCodeExistResult,
  AuthDetailResult,
  AuthListResult,
  AuthMutationResult,
} from "@/features/auth/api";
import type { Auth } from "@/features/auth/schema";
import type { SigninResult } from "@/features/auth/signin.api";
import type { ConstListResult } from "@/shared/api/const";
import type {
  BoardDetailResult,
  BoardListResult,
  BoardMutationResult,
  CommentMutationResult,
} from "@/features/board/api";
import type { Board } from "@/features/board/schema";
import type {
  UserDetailResult,
  UserExistsResult,
  UserListResult,
  UserMutationResult,
} from "@/features/user/api";
import type { User } from "@/features/user/schema";

// 공통 mock 핸들러.
// - vitest(jsdom): node 환경에서 server.ts가 사용
// - 브라우저: browser.ts의 service worker가 사용 (E2E + 백엔드 없는 dev)
//
// 상태 없는 stateless mock. 같은 요청에 같은 응답. 등록/수정/삭제 흐름의
// 응답 형태와 success/data 분기만 검증한다.

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

const logoutHandler = http.post("/api/auth/logout", () => {
  return HttpResponse.json({
    message: "로그아웃 되었습니다.",
    result: { success: true },
  });
});

const refreshHandler = http.get("/api/auth/refresh", () => {
  return HttpResponse.json({
    message: "ok",
    result: {
      success: true,
      accessToken: "mock-refreshed-access-token",
      refreshToken: "mock-refresh-token",
    },
  });
});

// ─── 공통 상수 ────────────────────────────────────────────────────
const constListHandler = http.get("/api/const/list", () => {
  const body: ApiResponse<ConstListResult & { success: boolean }> = {
    message: "ok",
    result: {
      success: true,
      data: {
        SSE_AUTH_CODE_UPDATE: "SSE_AUTH_CODE_UPDATE",
        SSE_AUTH_CODE_DELETE: "SSE_AUTH_CODE_DELETE",
      },
    },
  };
  return HttpResponse.json(body);
});

// ─── 권한 코드 (auth-code) ────────────────────────────────────────
const MOCK_AUTHS: Auth[] = [
  { _id: "1", code: "ADMIN", name: "관리자", desc: "최고 권한" },
  { _id: "2", code: "USER", name: "사용자", desc: "일반 권한" },
];

const authListHandler = http.get("/api/auth-code/list", () => {
  const body: ApiResponse<AuthListResult> = {
    message: "ok",
    result: {
      success: true,
      data: { auths: MOCK_AUTHS, total: MOCK_AUTHS.length, page: 1, limit: 10 },
    },
  };
  return HttpResponse.json(body);
});

const authDetailHandler = http.get(
  "/api/auth-code/find",
  ({ request }) => {
    const url = new URL(request.url);
    const _id = url.searchParams.get("_id") ?? "1";
    const found = MOCK_AUTHS.find((a) => a._id === _id) ?? MOCK_AUTHS[0];
    const body: ApiResponse<AuthDetailResult> = {
      message: "ok",
      result: { success: true, data: found },
    };
    return HttpResponse.json(body);
  },
);

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

const authUpdateHandler = http.put(
  "/api/auth-code/update",
  async ({ request }) => {
    const data = (await request.json()) as Auth & { _id: string };
    const body: ApiResponse<AuthMutationResult> = {
      message: "updated",
      result: { success: true, data },
    };
    return HttpResponse.json(body);
  },
);

const authDeleteHandler = http.delete("/api/auth-code/delete", () => {
  const body: ApiResponse<AuthMutationResult> = {
    message: "deleted",
    result: { success: true },
  };
  return HttpResponse.json(body);
});

// success가 true면 사용 가능한 코드 (백엔드 isCodeInUse 동작 따라)
const authCodeExistHandler = http.get(
  "/api/auth-code/check-code",
  ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code") ?? "";
    const inUse = MOCK_AUTHS.some((a) => a.code === code);
    const body: ApiResponse<AuthCodeExistResult> = {
      message: inUse ? "이미 존재" : "사용 가능",
      result: { success: !inUse },
    };
    return HttpResponse.json(body);
  },
);

// ─── 사용자 (user) ───────────────────────────────────────────────
const MOCK_USERS: User[] = [
  {
    _id: "u1",
    username: "alice",
    password: "",
    name: "앨리스",
    email: "alice@example.com",
    phone: "010-1111-2222",
    role: [{ value: "USER", label: "사용자", selected: true }],
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    _id: "u2",
    username: "bob",
    password: "",
    name: "밥",
    role: [],
    createdAt: "2025-01-02T00:00:00.000Z",
  },
];

const userListHandler = http.get("/api/user/list", () => {
  const body: ApiResponse<UserListResult> = {
    message: "ok",
    result: {
      success: true,
      data: { users: MOCK_USERS, total: MOCK_USERS.length, page: 1, limit: 3 },
    },
  };
  return HttpResponse.json(body);
});

const userDetailHandler = http.get(
  "/api/user/find",
  ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username") ?? "alice";
    const found =
      MOCK_USERS.find((u) => u.username === username) ?? MOCK_USERS[0];
    const body: ApiResponse<UserDetailResult> = {
      message: "ok",
      result: { success: true, data: found },
    };
    return HttpResponse.json(body);
  },
);

const userCheckExistHandler = http.get(
  "/api/user/check-exist",
  ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username") ?? "";
    const body: ApiResponse<UserExistsResult> = {
      message: "ok",
      result: {
        success: true,
        data: { exists: MOCK_USERS.some((u) => u.username === username) },
      },
    };
    return HttpResponse.json(body);
  },
);

const userCreateHandler = http.post("/api/user/create", async ({ request }) => {
  const data = (await request.json()) as Partial<User>;
  const body: ApiResponse<UserMutationResult> = {
    message: "created",
    result: {
      success: true,
      data: { ...(data as User), _id: "new-user-id", password: "" },
    },
  };
  return HttpResponse.json(body);
});

const userCreateWithFileHandler = http.post(
  "/api/user/create-with-file",
  () => {
    const body: ApiResponse<UserMutationResult> = {
      message: "created",
      result: {
        success: true,
        data: {
          _id: "new-user-id",
          username: "new-user",
          password: "",
          profileImage: "/uploads/mock-file.png",
        },
      },
    };
    return HttpResponse.json(body);
  },
);

const userUpdateHandler = http.put("/api/user/update", async ({ request }) => {
  const data = (await request.json()) as Partial<User>;
  const body: ApiResponse<UserMutationResult> = {
    message: "updated",
    result: {
      success: true,
      data: { ...(data as User), _id: "u1", password: "" },
    },
  };
  return HttpResponse.json(body);
});

const userUpdateWithFileHandler = http.put(
  "/api/user/update-with-file",
  () => {
    const body: ApiResponse<UserMutationResult> = {
      message: "updated",
      result: {
        success: true,
        data: {
          _id: "u1",
          username: "alice",
          password: "",
          profileImage: "/uploads/mock-file.png",
        },
      },
    };
    return HttpResponse.json(body);
  },
);

const userDeleteHandler = http.delete("/api/user/delete", () => {
  const body: ApiResponse<UserMutationResult> = {
    message: "deleted",
    result: { success: true },
  };
  return HttpResponse.json(body);
});

// 이미지 미리보기 (binary blob). 1×1 투명 PNG 더미.
const imagePreviewHandler = http.get("/api/user/uploads/:filename", () => {
  const png = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x62, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
  return new HttpResponse(png, {
    headers: { "Content-Type": "image/png" },
  });
});

// ─── 게시판 (board) ──────────────────────────────────────────────
const MOCK_BOARDS: Board[] = [
  {
    _id: "b1",
    title: "샘플 게시글",
    contents: "내용입니다",
    username: "tester",
    createDate: "2025-01-01T00:00:00.000Z",
    comments: [],
  },
];

const boardListHandler = http.get("/api/board/list", () => {
  const body: ApiResponse<BoardListResult> = {
    message: "ok",
    result: {
      success: true,
      data: {
        boards: MOCK_BOARDS,
        total: MOCK_BOARDS.length,
        page: 1,
        limit: 5,
      },
    },
  };
  return HttpResponse.json(body);
});

const boardDetailHandler = http.get(
  "/api/board/find",
  ({ request }) => {
    const url = new URL(request.url);
    const boardId = url.searchParams.get("boardId") ?? "b1";
    const found =
      MOCK_BOARDS.find((b) => b._id === boardId) ?? MOCK_BOARDS[0];
    const body: ApiResponse<BoardDetailResult> = {
      message: "ok",
      result: { success: true, data: found },
    };
    return HttpResponse.json(body);
  },
);

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

const boardUpdateHandler = http.put(
  "/api/board/update",
  async ({ request }) => {
    const data = (await request.json()) as {
      _id: string;
      title: string;
      contents: string;
    };
    const body: ApiResponse<BoardMutationResult> = {
      message: "updated",
      result: {
        success: true,
        data: {
          _id: data._id,
          title: data.title,
          contents: data.contents,
          username: "tester",
          createDate: "2025-01-01T00:00:00.000Z",
        },
      },
    };
    return HttpResponse.json(body);
  },
);

const boardDeleteHandler = http.delete("/api/board/delete", () => {
  const body: ApiResponse<BoardMutationResult> = {
    message: "deleted",
    result: { success: true },
  };
  return HttpResponse.json(body);
});

const boardAddCommentHandler = http.post(
  "/api/board/add-comment",
  async ({ request }) => {
    const data = (await request.json()) as {
      boardId: string;
      comment: string;
      username: string;
    };
    const body: ApiResponse<CommentMutationResult> = {
      message: "added",
      result: {
        success: true,
        data: {
          _id: "new-comment",
          boardId: data.boardId,
          username: data.username,
          comment: data.comment,
          date: new Date().toISOString(),
        },
      },
    };
    return HttpResponse.json(body);
  },
);

const boardRemoveCommentHandler = http.delete(
  "/api/board/remove-comment",
  () => {
    const body: ApiResponse<CommentMutationResult> = {
      message: "removed",
      result: { success: true },
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
  // 인증
  signinHandler,
  logoutHandler,
  refreshHandler,
  // 공통
  constListHandler,
  // 권한 코드
  authListHandler,
  authDetailHandler,
  authCreateHandler,
  authUpdateHandler,
  authDeleteHandler,
  authCodeExistHandler,
  // 사용자
  userListHandler,
  userDetailHandler,
  userCheckExistHandler,
  userCreateHandler,
  userCreateWithFileHandler,
  userUpdateHandler,
  userUpdateWithFileHandler,
  userDeleteHandler,
  imagePreviewHandler,
  // 게시판
  boardListHandler,
  boardDetailHandler,
  boardCreateHandler,
  boardUpdateHandler,
  boardDeleteHandler,
  boardAddCommentHandler,
  boardRemoveCommentHandler,
  // SSE
  sseHandler,
];
