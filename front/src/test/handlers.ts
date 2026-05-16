import { http, HttpResponse } from "msw";
import type { ApiResponse } from "@/shared/api/types";
import type {
  AuthListResult,
  AuthMutationResult,
} from "@/features/auth/api";
import type { Auth } from "@/features/auth/schema";

// 기본 핸들러. 개별 테스트가 `server.use(...)`로 응답을 override.
export const handlers = [
  http.get("/api/auth-code/list", () => {
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
  }),

  http.post("/api/auth-code/create", async ({ request }) => {
    const data = (await request.json()) as Auth;
    const body: ApiResponse<AuthMutationResult> = {
      message: "created",
      result: {
        success: true,
        data: { ...data, _id: "new-id" },
      },
    };
    return HttpResponse.json(body);
  }),
];
