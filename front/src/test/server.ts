import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// jsdom 테스트 환경에서 fetch를 가로채는 msw 서버.
// 각 테스트 파일에서 beforeAll/afterEach/afterAll로 라이프사이클 관리.
export const server = setupServer(...handlers);
