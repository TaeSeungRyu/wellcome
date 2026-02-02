import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useEffect } from "react";
import { useConstState } from "@/state/useConstState";
import { requestConstList } from "./-/common.repository";

export const Route = createRootRoute({
  component: () => {
    const sharedValue = useConstState((s) => s.sharedValue);
    const updateValue = useConstState((s) => s.updateValue);

    useEffect(() => {
      if (!sharedValue || Object.keys(sharedValue).length === 0) {
        requestConstList()
          .then((arg) => {
            updateValue(arg.result.data);
          })
          .catch((error) => {
            console.error("Failed to fetch const list:", error);
          });
      }
    }, [sharedValue, updateValue]);
    return (
      <>
        <Outlet />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </>
    );
  },
});
