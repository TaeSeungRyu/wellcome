import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 *
 */
export const Route = createFileRoute("/login")({
  component: LoginLayout,
  beforeLoad: async ({}) => {
    // You can add login-specific logic here if needed
  },
});

function LoginLayout() {
  return (
    <div>
      <div>login head</div>
      <Outlet />
    </div>
  );
}
