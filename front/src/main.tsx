import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ModalProvider from "./components/modal/modal.provider.tsx";
import ToastProvider from "./components/toast/toast.provider.tsx";
import { AuthProvider } from "./context/auth.context.tsx";
import { globalToast } from "./context/toast.context.tsx";

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // background fetch 에러는 제외하고 싶을 때 조건문 추가 가능
      if (query.state.data !== undefined) return;

      const message =
        error instanceof Error
          ? error.message
          : "데이터 로드 중 에러가 발생했습니다.";
      globalToast.error(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // 뮤테이션(등록, 수정, 삭제)은 대부분 즉각적인 피드백이 필요함
      const message =
        error instanceof Error
          ? error.message
          : "요청 처리 중 에러가 발생했습니다.";
      globalToast.error(message);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1, // 재시도 횟수 (기본: 3)
      staleTime: 1000 * 1, // 데이터 신선 유지 시간
      gcTime: 1000 * 1, // 캐시 데이터 제거 시간
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 0, // mutation 실패 시 재시도 없음
    },
  },
});
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <ModalProvider>
              <RouterProvider router={router} />
            </ModalProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
reportWebVitals();
