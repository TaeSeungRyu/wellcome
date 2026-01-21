import { useCallback, useState } from "react";
import ToastComponent from "./toast.component";
import { ToastContext, type ToastItem } from "@/context/toast.context";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, options?: { type?: any; duration?: number }) => {
      const toast: ToastItem = {
        id: crypto.randomUUID(),
        message,
        type: options?.type ?? "info",
        duration: options?.duration ?? 1000,
        visible: true,
      };
      setQueue((prev) => [...prev, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateToast = useCallback((id: string, partial: Partial<ToastItem>) => {
    setQueue((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...partial } : t)),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, updateToast, removeToast }}>
      {children}
      <ToastComponent toasts={queue} />
    </ToastContext.Provider>
  );
}
