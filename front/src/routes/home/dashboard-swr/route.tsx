import { createFileRoute } from "@tanstack/react-router";
import useSWR from "swr";
import { requestBoardList } from "../dashboard/-/board.repository";

export const Route = createFileRoute("/home/dashboard-swr")({
  component: RouteComponent,
});

function RouteComponent() {
  const page = 1;
  const limit = 5;
  const { data } = useSWR(["boardList", page, limit], ([, page, limit]) =>
    requestBoardList(page, limit),
  );
  return <div>Hello "/home/dashboard-swr"!</div>;
}
