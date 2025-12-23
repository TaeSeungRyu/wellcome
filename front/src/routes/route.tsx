import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({}) => {
    throw redirect({
      to: "/login/signin",
    });
  },
  component: () => <Outlet />,
});
