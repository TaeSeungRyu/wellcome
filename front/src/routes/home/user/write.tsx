import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/user/write")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>데이터 등록 페이지</div>;
}
