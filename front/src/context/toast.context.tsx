// toast-context.tsx
import { createContext, useContext } from "react";

// toast.types.ts
export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  visible: boolean; // ⭐ 추가
}

interface ToastContextType {
  showToast: (
    message: string,
    options?: {
      type?: ToastType;
      duration?: number;
    }
  ) => void;
  updateToast: (id: string, partial: Partial<ToastItem>) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
};
