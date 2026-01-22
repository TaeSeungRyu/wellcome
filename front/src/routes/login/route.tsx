import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginLayout,
});

function LoginLayout() {
  return (
    // 전체 화면 배경: 회색 톤과 Flexbox 중앙 정렬
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고나 브랜드명이 들어갈 자리 */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-600">계정에 로그인하세요</p>
        </div>

        {/* 실제 로그인 폼 컨텐츠 (Outlet) */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
