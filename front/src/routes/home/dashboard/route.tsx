import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/home/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const testMove = () => {
    router.navigate({
      to: "/home/user",
    });
  };
  return (
    <div>
      <div>Dashboard Page</div>
      <button
        onClick={testMove}
        className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
      >
        유저 페이지 이동 테스트
      </button>
    </div>
  );
}
