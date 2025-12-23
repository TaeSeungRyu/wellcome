import HeaderComponent from "@/components/layout/header";
import AuthGuard from "@/context/authGuard";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: HomeLayout,
  beforeLoad: async ({}) => {}, //TODO : auth..
});

function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthGuard></AuthGuard>
      <HeaderComponent></HeaderComponent>
      <Outlet />
      <div>tail</div>
    </div>
  );
}
