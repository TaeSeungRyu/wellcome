import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ModalProvider from "./components/modal/modalProvider.tsx";
import ToastProvider from "./components/toast/toastProvider.tsx";
import { AuthProvider } from "./context/authContext.tsx";

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
    </StrictMode>
  );
}
reportWebVitals();
