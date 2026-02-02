import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useEffect, useRef } from "react";
import { useConstState } from "@/state/useConstState";
import { requestConstList } from "./-/common.repository";

export const Route = createRootRoute({
  component: () => {
    const sharedValue = useConstState((s) => s.sharedValue);
    const updateValue = useConstState((s) => s.updateValue);
    const isAccess = useRef(false);

    useEffect(() => {
      if (!sharedValue || Object.keys(sharedValue).length === 0) {
        if (!isAccess.current) {
          isAccess.current = true;
          requestConstList()
            .then((arg) => {
              updateValue(arg.result.data);
              isAccess.current = false;
            })
            .catch((error) => {
              console.error("Failed to fetch const list:", error);
            });
        }
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
