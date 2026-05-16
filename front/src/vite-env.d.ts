/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_PROXY_TARGET?: string;
  // dev 모드에서 msw service worker로 API 응답을 mock한다.
  // E2E 테스트나 백엔드 없는 개발 환경에서 사용.
  readonly VITE_USE_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
