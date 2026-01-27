import { createFileRoute } from "@tanstack/react-router";
import { useUserDetail } from "./-/use.user.hook";
import { useEffect } from "react";

export const Route = createFileRoute("/home/user/info")({
  component: RouteComponent,
  validateSearch: (search) => ({
    username: String(search.username || ""),
  }),
  beforeLoad: (context) => {
    const { username } = context.search;
    if (!username) {
      throw new Error("username is required");
    }
  },
});

function RouteComponent() {
  const { username } = Route.useSearch();
  const { data: info } = useUserDetail(username);

  useEffect(() => {
    console.log("User Info:", info);
  }, [info]);

  return <div>Hello "/home/user/info"!</div>;
}
