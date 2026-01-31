import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  //설계
  /**
   * 1. 리스트
   * 2. 생성
   * 3. 수정
   * 4. 삭제
   */
  return <div>Hello "/home/auth/"!</div>;
}
