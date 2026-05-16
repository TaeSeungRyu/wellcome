import { test, expect } from "@playwright/test";

// msw로 모든 API가 mock되는 환경에서, 로그인 → 대시보드 → 게시글 등록까지의 흐름을 검증한다.
// (playwright.config.ts의 webServer.env에서 VITE_USE_MOCK_API=true)

test.describe("로그인 → 대시보드 풀 흐름", () => {
  test("정상 입력 후 로그인하면 대시보드로 이동하고 목록이 표시된다", async ({ page }) => {
    await page.goto("/login/signin");

    await page.getByPlaceholder("아이디를 입력하세요").fill("tester");
    await page.getByPlaceholder("비밀번호를 입력하세요").fill("password");
    await page.getByRole("button", { name: "로그인" }).click();

    // 토스트 + 1초 후 navigate. dashboard URL로 이동까지 대기.
    await expect(page).toHaveURL(/\/home\/dashboard/, { timeout: 5000 });

    // mock된 게시글 1건이 표시된다
    await expect(page.getByText("샘플 게시글")).toBeVisible();
  });

  test("대시보드에서 새 데이터 등록 모달을 열고 등록 흐름을 진행한다", async ({ page }) => {
    // 로그인부터 시작
    await page.goto("/login/signin");
    await page.getByPlaceholder("아이디를 입력하세요").fill("tester");
    await page.getByPlaceholder("비밀번호를 입력하세요").fill("password");
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page).toHaveURL(/\/home\/dashboard/, { timeout: 5000 });

    // 새 데이터 등록 버튼 클릭 → 모달
    await page.getByRole("button", { name: /새 데이터 등록/ }).click();
    await expect(page.getByText("데이터 등록")).toBeVisible();

    // 폼 입력
    await page.getByPlaceholder("제목을 입력하세요").fill("E2E 제목");
    await page.getByPlaceholder("내용을 입력하세요").fill("E2E 내용입니다");

    // 제출 → 확인 모달 → 등록 클릭
    await page.getByRole("button", { name: "제출" }).click();
    await expect(page.getByText(/데이터를 등록하시겠습니까/)).toBeVisible();
    await page.getByRole("button", { name: "등록" }).click();

    // mutation 후 success toast (sonner)
    await expect(page.getByText(/완료 하였습니다|created/)).toBeVisible({
      timeout: 5000,
    });
  });
});
