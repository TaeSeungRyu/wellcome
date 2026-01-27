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
    },
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

// 외부에서 호출할 함수 타입을 저장할 변수
let toastFn: (
  message: string,
  options?: { type: ToastType },
) => void = () => {};

export const setGlobalToast = (fn: typeof toastFn) => {
  toastFn = fn;
};

export const globalToast = {
  error: (msg: string) => toastFn(msg, { type: "error" }),
  success: (msg: string) => toastFn(msg, { type: "success" }),
};
