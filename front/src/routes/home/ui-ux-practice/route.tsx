import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/home/ui-ux-practice")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>Hello "/ui-ux-practice"!</div>
      <button
        className="toast-button"
        onClick={() => {
          toast("This is a toast");
          console.log("Toast should have been rendered");
        }}
      >
        Render toast
      </button>
    </>
  );
}
