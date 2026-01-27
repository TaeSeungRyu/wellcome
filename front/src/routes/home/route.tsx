import HeaderComponent from "@/components/layout/header";
import { getUserName, useAuth } from "@/context/auth.context";
import AuthGuard from "@/context/auth.guard";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSSEHook } from "./-/use.sse.hook";
import { useCallback } from "react";

export const Route = createFileRoute("/home")({
  component: HomeLayout,
});

function HomeLayout() {
  const { token } = useAuth();
  const username = getUserName();

  const handleMessage = useCallback((data: any) => {
    console.log("SSE Message 수신:", data);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error("SSE Error 발생:", error);
  }, []);
  useSSEHook(username, token, handleMessage, handleError);

  return (
    // 1. 전체 화면을 h-screen으로 잡고 배경색을 일관되게 적용
    <div className="flex flex-col h-screen bg-slate-50">
      <AuthGuard />

      {/* 2. 상단 헤더: 상단 고정 및 그림자 효과 */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <HeaderComponent />
      </header>

      {/* 3. 메인 컨텐츠 영역: 스크롤 가능 구역 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Outlet 내부의 컴포넌트들이 들어올 자리 */}
          <div className="animate-in fade-in duration-500">
            <Outlet />
          </div>
        </div>
      </main>

      {/* 4. SSE 알림 배너 (선택 사항): 메시지 수신 시 보여줄 토스트나 인디케이터용 공간 */}
      <div className="fixed bottom-4 right-4 z-[100] pointer-events-none">
        {/* 여기에 실시간 알림 팝업 등이 렌더링될 수 있습니다 */}
      </div>
    </div>
  );
}
