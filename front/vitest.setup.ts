import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 각 테스트 후 DOM 정리. RTL v16+는 자동 cleanup이 보장되지 않으므로 명시한다.
afterEach(() => {
  cleanup();
});
