import HeaderComponent from "@/components/layout/header";
import { getUserName, useAuth } from "@/context/authContext";
import AuthGuard from "@/context/authGuard";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSSEHook } from "./-/useSseHook";
import { useCallback } from "react";

export const Route = createFileRoute("/home")({
  component: HomeLayout,
  beforeLoad: async ({}) => {},
});

function HomeLayout() {
  const { token } = useAuth();
  const username = getUserName();

  //메시지 핸들러
  const handleMessage = useCallback((data: any) => {
    console.log("SSE Message 수신:", data);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error("SSE Error 발생:", error);
  }, []);

  //SSE 훅 사용
  useSSEHook(username, token, handleMessage, handleError);

  return (
    <div className="min-h-screen flex flex-col">
      <AuthGuard></AuthGuard>
      <HeaderComponent></HeaderComponent>
      <Outlet />
      <div>tail</div>
    </div>
  );
}
