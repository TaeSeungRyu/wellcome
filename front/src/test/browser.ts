import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 브라우저 환경에서 msw 서비스 워커로 API를 mock한다.
// main.tsx에서 dev 모드 + VITE_USE_MOCK_API=true 인 경우만 시작한다.
export const worker = setupWorker(...handlers);
