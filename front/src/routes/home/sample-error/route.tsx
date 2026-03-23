import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/sample-error")({
  component: RouteComponent,
});

function RenderingError() {
  if (3 > 1) {
    throw new Error("렌더링 에러");
  }
  return <div>이 부분은 렌더링되지 않습니다.</div>;
}

function RouteComponent() {
  const handlerError = () => {
    throw new Error("클릭 에러");
  };

  return (
    <>
      <div>Hello "/home/sample-error"!</div>
      <button onClick={handlerError} className="rounded border px-4 py-2">
        에러 발생 버튼
      </button>
      <RenderingError></RenderingError>
    </>
  );
}
