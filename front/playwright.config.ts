import { defineConfig, devices } from "@playwright/test";

// E2E 설정.
// - testDir: e2e/ 디렉토리 안의 spec만 실행 (vitest의 src/**/*.test.* 와 분리)
// - webServer: 테스트 시작 전 자동으로 yarn dev (port 3000) 띄움.
//   이미 떠있다면 reuseExistingServer로 재사용.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "yarn dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
    // msw service worker로 모든 API를 mock한다.
    // 백엔드 의존 없이 풀 흐름을 E2E로 검증 가능.
    env: { VITE_USE_MOCK_API: "true" },
  },
});
