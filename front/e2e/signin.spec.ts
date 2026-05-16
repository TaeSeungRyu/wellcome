import { test, expect } from "@playwright/test";

// 백엔드 없이도 검증 가능한 흐름만 다룬다.
// 풀 로그인 → 대시보드 흐름은 E2E 2차 (msw browser mode 또는 백엔드 seed)에서 진행.
test.describe("/login/signin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login/signin");
  });

  test("로그인 폼이 렌더링된다", async ({ page }) => {
    await expect(page.getByPlaceholder("아이디를 입력하세요")).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호를 입력하세요")).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
  });

  test("아이디/비밀번호를 타이핑하면 input value가 반영된다", async ({ page }) => {
    const idInput = page.getByPlaceholder("아이디를 입력하세요");
    const pwInput = page.getByPlaceholder("비밀번호를 입력하세요");

    await idInput.fill("tester");
    await pwInput.fill("secret");

    await expect(idInput).toHaveValue("tester");
    await expect(pwInput).toHaveValue("secret");
  });

  test("3자 미만 입력 시 zod 검증 메시지가 표시된다", async ({ page }) => {
    const idInput = page.getByPlaceholder("아이디를 입력하세요");
    await idInput.fill("a");
    await idInput.blur();

    await expect(
      page.getByText("텍스트는 최소 3자 이상이어야 합니다."),
    ).toBeVisible();
  });
});
